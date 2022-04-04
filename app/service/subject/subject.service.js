import db from '../../db/models'
import {badRequest, FIELD_ERROR} from '../../config/error';
import {SUBJECT_TYPE} from "../../db/models/partner/subject";
import {hasText} from "../../util/string.util";
import {updateItemTags} from "../tagging/tagging.service";
import {TAGGING_TYPE} from "../../db/models/tagging/tagging-item-type";
import {auditAction} from "../audit/audit.service";
import {PERMISSION} from "../../db/models/acl/acl-action";
import {addTaggingQueue} from "../../queue/tagging.queue";
import {getPerson} from "../person/person.service";
import {getCompany} from "../company/company.service";

const {Op} = db.Sequelize;

export function listSubject(user, query, {order, offset, limit}) {
  const {search} = query;
  // eslint-disable-next-line no-unused-vars
  let isRequired = false;
  let where = {
    companyId: user.companyId
  };
  if (hasText(search)) {
    isRequired = true;
    where = {
      ...where,
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`
          }
        },
        {
          email: {
            [Op.like]: `%${search}%`
          }
        },
        {
          gsm: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  }

  return db.Subject.findAndCountAll({
    where,
    include: [
      {
        model: db.Person, as: 'person'
      },
      {model: db.Company, as: 'company'},
      {
        model: db.User, as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: db.Person, as: 'contactPerson'
      },
      {
        model: db.Tagging, as: 'tagging',
        attributes: ['id', 'label', 'color']
      }
    ],
    order,
    offset,
    limit,
    group: [`subject.id`]
  }).then((resp) => {
    console.log(resp)
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function getSubject(pId, user) {
  const person = await db.Subject.findOne({
    where: {
      id: pId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Person, as: 'person'
      },
      {
        model: db.Company, as: 'company'
      },
      {model: db.Asset, as: 'image'},
      {model: db.Person, as: 'contactPerson'},
      {
        model: db.Tagging, as: 'tagging',
        attributes: ['id', 'label', 'color']
      }
    ]
  });
  if (!person) {
    throw badRequest('subject', FIELD_ERROR.INVALID, 'Subject not found');
  }
  return person;
}

export async function createSubject(user, createForm) {
  const {
    type,
    company,
    person,
    remark,
    contactPerson,
    asset,
    tagging
  } = createForm;
  const transaction = await db.sequelize.transaction();
  try {
    let name;
    let gsm;
    let email;
    if (Number(type) === SUBJECT_TYPE.COMPANY) {
      // eslint-disable-next-line prefer-destructuring
      name = company.name;
      // eslint-disable-next-line prefer-destructuring
      gsm = company.gsm;
      // eslint-disable-next-line prefer-destructuring
      email = company.email;
    } else {
      name = `${person.firstName} ${person.lastName}`;
      // eslint-disable-next-line prefer-destructuring
      gsm = person.gsm;
      // eslint-disable-next-line prefer-destructuring
      email = person.email;
    }

    const newSubject = await db.Subject.create({
      name,
      gsm, email,
      companyId: user.companyId,
      type: Number(type),
      subjectCompanyId: company?.id || 0,
      remark,
      personId: person?.id || 0,
      contactPersonId: contactPerson?.id || 0,
      createdDate: new Date(),
      lastActionedDate: new Date(),
      createdById: user.id,
      imageId: asset?.id
    }, {transaction})

    if (tagging && tagging.length) {
      await updateItemTags({
        id: newSubject.id,
        type: TAGGING_TYPE.SUBJECT,
        transaction,
        newTags: tagging
      });
    }
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.CUSTOMER.CREATE,
      user,
      relativeId: String(newSubject.id)
    }).then();
    if (tagging && tagging.length) {
      addTaggingQueue([...new Set(tagging.map(t => t.id))]);
    }

    return {
      ...newSubject.get({plain: true}),
      person,
      company
    };
  } catch (e) {
    console.error(e)
    await transaction.rollback();
    if (e.name === 'SequelizeUniqueConstraintError') {
      throw badRequest('subject', FIELD_ERROR.EXISTED, 'Subject is existed')
    }
    throw e;
  }
}

export async function updateSubject(pId, updateForm, user) {
  const existed = await getSubject(pId, user);
  const {
    company,
    person,
    remark,
    contactPerson,
    asset,
    tagging
  } = updateForm;
  const transaction = await db.sequelize.transaction();
  try {
    if (existed.type === SUBJECT_TYPE.COMPANY) {
      existed.name = company.name;
      existed.email = company.email;
      existed.gsm = company.gsm;
      existed.contactPersonId = contactPerson?.id;
      existed.subjectCompanyId = company.id;
    } else {
      existed.name = person.fullName;
      existed.email = person.email;
      existed.gsm = person.gsm;
      existed.personId = person.id;
    }
    /**
     * Set 0 here for MYSQL validate unique key (unique key not work on null value)
     * */
    existed.imageId = asset?.id;
    existed.remark = remark;
    existed.lastActionedDate = new Date();
    await existed.save({transaction})

    let listUpdateTags = []
    console.log('Existed tagging', existed.tagging)
    if ((tagging && tagging.length) || (existed.tagging && existed.tagging.length)) {
      await updateItemTags({
        id: existed.id,
        type: TAGGING_TYPE.SUBJECT,
        transaction,
        newTags: tagging
      });

      listUpdateTags = [...new Set([...((tagging || []).map(t => t.id)),
        ...((existed.tagging || []).map(t => t.id))])]
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.CUSTOMER.UPDATE,
      user,
      relativeId: String(pId)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeSubject(pId, user) {
  const existed = await getSubject(pId, user);
  const transaction = await db.sequelize.transaction();
  try {
    await existed.destroy({transaction})
    await transaction.commit();
    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getOrCreatePersonalSubject(user, pId, subjectCategoryId) {
  let rs = await db.Subject.findOne({
    where: {
      type: SUBJECT_TYPE.PERSONAL,
      personId: pId
    }
  })
  if (!rs) {
    const existedPerson = await getPerson(pId, user)
    rs = await db.Subject.create({
      name: existedPerson.fullName || `${existedPerson.firstName} ${existedPerson.lastName}`,
      gsm: existedPerson.gsm,
      email: existedPerson.email,
      companyId: user.companyId,
      type: SUBJECT_TYPE.PERSONAL,
      subjectCompanyId: 0,
      subjectCategoryId,
      personId: existedPerson.id,
      createdDate: new Date(),
      lastActionedDate: new Date(),
      createdById: user.id
    })
  }
  return rs;
}

export async function getOrCreateCompanySubject(user, cId, subjectCategoryId) {
  let rs = await db.Subject.findOne({
    where: {
      type: SUBJECT_TYPE.COMPANY,
      personId: cId
    }
  })
  if (!rs) {
    const company = await getCompany(cId, user)
    rs = await db.Subject.create({
      name: company.name,
      gsm: company.gsm,
      email: company.email,
      companyId: user.companyId,
      type: SUBJECT_TYPE.COMPANY,
      subjectCompanyId: company.id,
      subjectCategoryId,
      personId: 0,
      createdDate: new Date(),
      lastActionedDate: new Date(),
      createdById: user.id
    })
  }
  return rs;
}

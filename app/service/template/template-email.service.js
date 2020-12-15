import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {TEMPLATE_TYPE} from "../../db/models/template/template";

const {Op} = db.Sequelize;

export function listEmailTemplate(query, order, offset, limit, user) {
  const where = {};
  if (query) {
    if (query.search && query.search.length) {
      where.name = {
        [Op.like]: `%${query.search}%`
      };
    }
    if (query.typeId) {
      where.templateTypeId = query.typeId;
    }
  }

  where.companyId = user.companyId;
  return db.EmailTemplate.findAndCountAll({
    include: [
      {
        model: db.Template, required: true, where, as: 'template',
        order,
        include: [
          {
            model: db.User, as: 'createdBy',
            attributes: ['id', 'displayName', 'email']
          }, {
            model: db.TemplateType, as: 'templateType'
          }
        ]
      }
    ],
    offset,
    limit
  }).then(res => {
    return {
      count: res.count,
      rows: res.rows.map(t => {
        return {
          ...t.toJSON(),
          cc: t.cc && t.cc.length ? t.cc.split(',') : null,
          bcc: t.bcc && t.bcc.length ? t.bcc.split(',') : null
        };
      })
    }
  });
}

export async function getEmailTemplate(id, user) {
  const rs = await db.EmailTemplate.findOne({
    where: {
      templateId: id
    },
    include: [
      {
        model: db.Template, required: true, where: {companyId: user.companyId}, as: 'template',
        include: [
          {
            model: db.User, as: 'createdBy',
            attributes: ['id', 'displayName', 'email']
          }, {
            model: db.TemplateType, as: 'templateType'
          }
        ]
      }
    ]
  });
  if (!rs) {
    throw badRequest('emailTemplate', FIELD_ERROR.INVALID, 'Email Template not found');
  }

  const json = rs.toJSON();

  return {
    ...json,
    cc: json.cc && json.cc.length ? [...json.cc.split(',')] : null,
    bcc: json.bcc && json.bcc.length ? [...json.bcc.split(',')] : null
  };
}

export async function createEmailTemplate(user, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const template = await db.Template.create({
      name: createForm.name,
      templateTypeId: createForm.templateTypeId,
      content: createForm.content,
      remark: createForm.remark,
      companyId: user.companyId,
      createdDate: new Date(),
      createdById: user.id,
      lastUpdatedDate: new Date(),
      type: TEMPLATE_TYPE.EMAIL
    }, {transaction});
    const emailTemplate = await db.EmailTemplate.create({
      templateId: template.id,
      subject: createForm.subject,
      from: createForm.from,
      cc: createForm.cc ? createForm.cc.join(',') : '',
      bcc: createForm.bcc ? createForm.bcc.join(',') : ''
    }, {transaction});
    await transaction.commit();
    return {
      template: template.get({plain: true}),
      ...emailTemplate.get({plain: true})
    }
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function updateEmailTemplate(id, user, updateForm) {

  const oldRs = await getEmailTemplate(id, user);

  if (!oldRs) {
    throw badRequest('template', FIELD_ERROR.INVALID, 'Email Template not found');
  }

  const transaction = await db.sequelize.transaction();
  try {
    oldRs.subject = updateForm.subject;
    oldRs.from = updateForm.from;
    oldRs.cc = updateForm.cc ? updateForm.cc.join(',') : '';
    oldRs.bcc = updateForm.bcc ? updateForm.bcc.join(',') : '';
    oldRs.template.name = updateForm.name;
    oldRs.template.content = updateForm.content;
    oldRs.template.remark = updateForm.remark || '';
    oldRs.template.templateTypeId = updateForm.templateTypeId;
    oldRs.template.lastUpdatedDate = new Date();
    await oldRs.save({
      transaction
    });
    await oldRs.template.save({transaction});
    await transaction.commit();
    return oldRs;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function removeEmailTemplate(id, user) {
  const oldRs = await getEmailTemplate(id, user);
  if (!oldRs) {
    throw badRequest('template', FIELD_ERROR.INVALID, 'Email Template not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await oldRs.template.destroy({transaction});
    await oldRs.destroy({transaction});
    await transaction.commit();
    return oldRs;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {TEMPLATE_TYPE} from "../../db/models/template/template";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";

const {Op} = db.Sequelize;

export function listTemplate(query, order, offset, limit, user) {
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
  where.type = TEMPLATE_TYPE.NORMAL;
  return db.Template.findAndCountAll({
    order,
    where,
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }, {
        model: db.TemplateType, as: 'templateType'
      }
    ],
    offset,
    limit
  });
}

export async function getTemplate(id, user) {
  const rs = await db.Template.findOne({
    where: {
      id, companyId: user.companyId
    },
    include: [
      {
        model: db.User, as: 'createdBy',
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      }, {
        model: db.TemplateType, as: 'templateType'
      }
    ]
  });
  if (!rs) {
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'inventory not found');
  }

  return rs;
}

export async function createTemplate(user, createForm) {
  return db.Template.create({
    name: createForm.name,
    templateTypeId: createForm.templateTypeId,
    content: createForm.content,
    remark: createForm.remark,
    companyId: user.companyId,
    createdDate: new Date(),
    createdById: user.id,
    lastUpdatedDate: new Date(),
    type: TEMPLATE_TYPE.NORMAL
  });
}

export async function updateTemplate(id, user, updateForm) {

  const oldRs = await getTemplate(id, user);

  if (!oldRs) {
    throw badRequest('template', FIELD_ERROR.INVALID, 'Template not found');
  }

  oldRs.name = updateForm.name;
  oldRs.content = updateForm.content;
  oldRs.remark = updateForm.remark || '';
  oldRs.templateTypeId = updateForm.templateTypeId;
  oldRs.lastUpdatedDate = new Date();

  return oldRs.save();
}

export async function removeTemplate(id, user) {
  const oldRs = await getTemplate(id, user);
  if (!oldRs) {
    throw badRequest('template', FIELD_ERROR.INVALID, 'Template not found');
  }
  await oldRs.destroy();
  return oldRs;
}

export function getTemplateTypes() {
  return db.TemplateType.findAll();
}

export function getTemplateTypeVariables(templateTypeId) {
  return db.TemplateTypePlugin.findAll({
    where: {
      templateTypeId: templateTypeId
    },
    include: [
      {model: db.TemplatePluginVariables, as: 'variables'}
    ]
  }).then((resp) => {
    let rs = [];
    resp.forEach(t => {
      try {
        rs = rs.concat(JSON.parse(t.variables.variables));
      } catch (e) {
        console.log(`Invalid: ${t.variables.variables}`)
      }

    })
    return rs;
  })
}

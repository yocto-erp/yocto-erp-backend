import { v4 as uuidv4 } from 'uuid';
import db from '../../db/models';
import { FormAssetType } from '../../db/models/form/form-asset';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { USER_ATTR_VIEW } from '../../db/models/user/user';

export const listForm = async (user, search, paging) => {
  return db.Form.findAndCountAll({
    where: {
      companyId: user.companyId
    },
    include: [
      { model: db.User, as: 'createdBy', attributes: USER_ATTR_VIEW }
    ],
    ...paging
  });
};

/**
 *
 * @param user
 * @param bodyForm
 *  - name
 *  - banner: Asset
 *  - introduction
 *  - classes: Array of class
 *  - products: Array of product
 *  - isAllowCreateUser
 */
export const createFormRegister = async (user, bodyForm) => {
  const { name, classes, products, banner, isAllowCreateUser, introduction, status } = bodyForm;
  const setting = {
    banner,
    isAllowCreateUser
  };
  const transaction = await db.sequelize.transaction();
  try {
    const form = await db.Form.create({
      name,
      companyId: user.companyId,
      description: introduction,
      createdDate: new Date(),
      createdById: user.id,
      status,
      setting,
      publicId: uuidv4()
    }, { transaction });
    const listFormAsset = [];
    let index = 0;
    if (classes && classes.length) {
      classes.forEach(t => {
        listFormAsset.push({
          formId: form.id,
          id: index,
          type: FormAssetType.CLASS,
          relativeId: t.id
        });
        index += 1;
      });
    }
    if (products && products.length) {
      products.forEach(t => {
        listFormAsset.push({
          formId: form.id,
          id: index,
          type: FormAssetType.PRODUCT,
          relativeId: t.id
        });
        index += 1;
      });
    }
    await db.FormAsset.bulkCreate(listFormAsset, { transaction });
    await transaction.commit();
    return form;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

const getForm = async (user, formId) => {
  const form = await db.Form.findOne({
    where: {
      id: formId,
      companyId: user.companyId
    }
  });
  if (!form) {
    throw badRequest('FORM', FIELD_ERROR.INVALID, 'Form not found');
  }
  return form;
};

export const updateFormRegister = async (user, id, bodyForm) => {
  const { name, classes, products, banner, isAllowCreateUser, introduction, status } = bodyForm;
  const setting = {
    banner,
    isAllowCreateUser
  };
  const existedForm = await getForm(user, id);
  const transaction = await db.sequelize.transaction();
  try {
    existedForm.description = introduction;
    existedForm.status = status;
    existedForm.setting = setting;
    existedForm.lastModifiedDate = new Date();
    existedForm.name = name;
    await existedForm.save({ transaction });
    const listFormAsset = [];
    let index = 0;
    if (classes && classes.length) {
      classes.forEach(t => {
        listFormAsset.push({
          formId: existedForm.id,
          id: index,
          type: FormAssetType.CLASS,
          relativeId: t.id
        });
        index += 1;
      });
    }
    if (products && products.length) {
      products.forEach(t => {
        listFormAsset.push({
          formId: existedForm.id,
          id: index,
          type: FormAssetType.PRODUCT,
          relativeId: t.id
        });
        index += 1;
      });
    }
    await db.FormAsset.destroy({
      where: {
        formId: existedForm.id
      }
    }, { transaction });
    await db.FormAsset.bulkCreate(listFormAsset, { transaction });
    await transaction.commit();
    return existedForm;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

const getFormInfo = async (form) => {
  const formAsset = await db.FormAsset.findAll({
    where: {
      formId: form.id
    },
    include: [
      {
        model: db.StudentClass, as: 'class',
        required: false,
        where: {
          '$formAsset.type$': FormAssetType.CLASS
        },
        attributes: ['id', 'name', 'tuitionFeePerMonth']
      },
      {
        model: db.EcommerceProduct, as: 'product',
        required: false,
        where: {
          '$formAsset.type$': FormAssetType.PRODUCT
        },
        attributes: ['id', 'webDisplayName', 'price', 'productId'],
        include: [
          { model: db.Asset, as: 'thumbnail' },
          { model: db.Product, as: 'product', attributes: ['id', 'productDocumentId'] },
          {
            model: db.ProductUnit, as: 'unit', where: {
              productId: {
                [db.Sequelize.Op.eq]: db.Sequelize.col('product.productId')
              }
            }
          }
        ]
      }
    ]
  });
  const rs = {
    id: form.id,
    name: form.name,
    introduction: form.description,
    classes: [],
    products: [],
    isAllowCreateUser: form.setting.isAllowCreateUser,
    banner: form.setting.banner,
    publicId: form.publicId,
    status: form.status
  };
  if (formAsset && formAsset.length) {
    formAsset.forEach(asset => {
      const { class: studentClass, product } = asset;
      if (studentClass) {
        rs.classes.push(studentClass);
      }
      if (product) {
        rs.products.push(product);
      }
    });
  }
  return rs;
};

export const getFormDetail = async (user, formId) => {
  const form = await getForm(user, formId);
  return getFormInfo(form);
};

export const getFormByPublic = async (publicId) => {
  const form = await db.Form.findOne({
    where: {
      publicId
    }
  });
  if (!form) {
    throw badRequest('FORM', FIELD_ERROR.INVALID, 'Invalid form publicId');
  }
  return getFormInfo(form);
};

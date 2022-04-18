import Sequelize from "sequelize";
import { TAGGING_TYPE } from "../tagging/tagging-item-type";

const { DataTypes } = Sequelize;

export const SUBJECT_TYPE = {
  PERSONAL: 1,
  COMPANY: 2
};

export const SUBJECT_CATEGORY = {
  PARENT: 1,
  CUSTOMER: 2,
  PARTNER: 3,
  OTHER: 100
};

export default class Subject extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) },
        gsm: { type: DataTypes.STRING(20) },
        email: { type: DataTypes.STRING(250) },
        companyId: { type: DataTypes.BIGINT },
        type: { type: DataTypes.TINYINT },
        subjectCompanyId: { type: DataTypes.BIGINT },
        contactPersonId: { type: DataTypes.BIGINT },
        subjectCategoryId: { type: DataTypes.INTEGER },
        personId: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        lastActionedDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        userId: { type: DataTypes.BIGINT },
        imageId: { type: DataTypes.BIGINT },
        remark: { type: DataTypes.TEXT }
      },
      {
        tableName: "subject",
        modelName: "subject",
        timestamps: false,
        sequelize,
        ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Person, {
      as: "person", foreignKey: "personId"
    });
    this.belongsTo(models.Company, {
      as: "company", foreignKey: "subjectCompanyId"
    });
    this.belongsTo(models.Person, { as: "contactPerson", foreignKey: "contactPersonId" });
    this.belongsTo(models.User, { as: "createdBy", foreignKey: "createdById" });
    this.belongsTo(models.Asset, { as: "image", foreignKey: "imageId" });
    this.hasMany(models.TaggingItem, {
      foreignKey: "itemId",
      as: "taggingItems"
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: TAGGING_TYPE.SUBJECT
        }
      },
      foreignKey: "itemId",
      as: "tagging"
    });
  }

  static defineScope(models) {
    this.addScope("all", {
      include: [
        {
          model: models.Person, as: "person"
        },
        { model: models.Company, as: "company" },
        {
          model: models.Person, as: "contactPerson"
        },
        {
          model: models.Asset, as: "image"
        }
      ]
    });
  }
}

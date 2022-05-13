import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class Audit extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        actionId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING(512) },
        companyId: { type: DataTypes.BIGINT },
        userId: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        remark: { type: DataTypes.TEXT },
        partnerPersonId: { type: DataTypes.BIGINT },
        subjectId: { type: DataTypes.BIGINT },
        partnerCompanyId: { type: DataTypes.BIGINT },
        relativeId: { type: DataTypes.STRING(128) },
        ip: { type: DataTypes.STRING(100) },
        userAgent: { type: DataTypes.TEXT }
      },
      {
        tableName: "audit",
        modelName: "audit",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Person, {
      foreignKey: "partnerPersonId",
      as: "partnerPerson"
    });
    this.belongsTo(models.Company, {
      foreignKey: "partnerCompanyId",
      as: "partnerCompany"
    });
    this.belongsTo(models.Subject, {
      foreignKey: "subjectId",
      as: "subject"
    });
    this.belongsTo(models.User, { foreignKey: "userId", as: "createdBy" });
  }
}

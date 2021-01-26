import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Audit extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        actionId: {type: DataTypes.INTEGER},
        companyId: {type: DataTypes.BIGINT},
        userId: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        remark: {type: DataTypes.TEXT},
        partnerPersonId: {type: DataTypes.BIGINT},
        partnerCompanyId: {type: DataTypes.BIGINT},
        relativeId: {type: DataTypes.STRING(128)}
      },
      {
        tableName: 'audit',
        modelName: 'audit',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Person, {
      foreignKey: 'partnerPersonId',
      as: 'partnerPerson'
    });
    this.belongsTo(models.Company, {
      foreignKey: 'partnerCompanyId',
      as: 'partnerCompany'
    });
    this.belongsTo(models.User, {foreignKey: 'userId', as: 'createdBy'});
  }
}

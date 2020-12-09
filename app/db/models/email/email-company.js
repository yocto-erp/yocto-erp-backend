import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class EmailCompany extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        emailId: {type: DataTypes.BIGINT, primaryKey: true},
        companyId: {type: DataTypes.INTEGER, primaryKey: true},
        userId: {type: DataTypes.INTEGER, primaryKey: true},
        createdDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'email_company',
        modelName: 'emailCompany',
        timestamps: false, ...opts,
        sequelize
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.EmailSend, {
      foreignKey: 'emailId',
      as: 'email'
    })
  }
}

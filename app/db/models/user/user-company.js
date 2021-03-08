import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const USER_INVITE_STATUS = {
  INVITED: 1,
  CONFIRMED: 2
}

export default class UserCompany extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        userId: {type: DataTypes.BIGINT, primaryKey: true},
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        groupId: {type: DataTypes.BIGINT, primaryKey: true},
        inviteStatus: {type: DataTypes.INTEGER},
        invitedDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'user_company',
        modelName: 'userCompany',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'});
    this.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
    this.belongsTo(models.ACLGroup, {foreignKey: 'groupId', as: 'group'});
    this.hasMany(models.ACLGroupAction, {
      foreignKey: 'groupId',
      sourceKey: 'groupId',
      as: 'permissions'
    });
  }
}

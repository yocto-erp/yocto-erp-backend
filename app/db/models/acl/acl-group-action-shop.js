import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class ACLGroupActionShop extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        groupId: {type: DataTypes.INTEGER, primaryKey: true},
        actionId: {type: DataTypes.INTEGER, primaryKey: true},
        shopId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'acl_group_action_shop',
        modelName: 'aclGroupActionShop',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }
}

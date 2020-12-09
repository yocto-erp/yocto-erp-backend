import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const ACTION_TYPE = Object.freeze({
  OWNER: 1, PARTIAL: 2, FULL: 3
});

export default class ACLGroupAction extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        groupId: {type: DataTypes.INTEGER, primaryKey: true},
        actionId: {type: DataTypes.INTEGER, primaryKey: true},
        type: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'acl_group_action',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Audit extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        actionId: {type: DataTypes.INTEGER},
        companyId: {type: DataTypes.BIGINT},
        userId: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        remark: {type: DataTypes.TEXT}
      },
      {
        tableName: 'audit',
        modelName: 'audit',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

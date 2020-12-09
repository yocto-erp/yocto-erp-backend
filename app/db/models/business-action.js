import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class BusinessAction extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(150)}
      },
      {
        tableName: 'business_action',
        modelName: 'businessAction',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

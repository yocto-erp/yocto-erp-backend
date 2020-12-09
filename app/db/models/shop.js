import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Shop extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(250)},
        address: {type: DataTypes.STRING(250)},
        phone: {type: DataTypes.STRING(20)},
        companyId: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        createdById: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'shop',
        modelName: 'shop',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

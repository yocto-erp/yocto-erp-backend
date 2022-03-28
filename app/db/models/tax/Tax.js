import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Tax extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(250)},
        shortName: {type: DataTypes.STRING(20)},
        type: {type: DataTypes.INTEGER},
        amount: {type: DataTypes.STRING(64)},
        companyId: {type: DataTypes.BIGINT},
        lastModifiedById: {type: DataTypes.BIGINT},
        lastModifiedDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'tax',
        modelName: 'tax',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

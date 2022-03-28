import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TaxSetDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        taxSetId: {type: DataTypes.BIGINT, primaryKey: true},
        taxId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'tax_set_detail',
        modelName: 'taxSetDetail',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TaxSet extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(250)},
        remark: {type: DataTypes.TEXT},
        numOfTax: {type: DataTypes.INTEGER},
        companyId: {type: DataTypes.BIGINT},
        lastModifiedById: {type: DataTypes.BIGINT},
        lastModifiedDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'tax_set',
        modelName: 'taxSet',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
    this.belongsToMany(models.Tax, {
      through: models.TaxSetDetail,
      foreignKey: 'taxSetId',
      otherKey: 'taxId',
      as: 'taxes'
    });
  }

}

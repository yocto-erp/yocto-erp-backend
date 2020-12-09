import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class PartnerPerson extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        personId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'partner_person',
        modelName: 'partnerPerson',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate (models) {
    this.belongsTo(models.Person);
  }
}

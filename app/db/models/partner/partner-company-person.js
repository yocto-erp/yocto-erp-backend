import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class PartnerCompanyPerson extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        partnerCompanyId: {type: DataTypes.BIGINT, primaryKey: true},
        personId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'partner_company_person',
        modelName: 'partnerCompanyPerson',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class PartnerCompany extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        partnerCompanyId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'partner_company',
        modelName: 'partnerCompany',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

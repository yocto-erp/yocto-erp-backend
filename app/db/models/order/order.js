import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const ORDER_TYPE  = {
  SALE: 1,
  PURCHASE: 2
};

export const ORDER_STATUS  = {}

export default class Order extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(150)},
        partnerPersonId: {type: DataTypes.BIGINT},
        partnerCompanyId: {type: DataTypes.BIGINT},
        type: {type: DataTypes.TINYINT},
        companyId: {type: DataTypes.BIGINT},
        totalAmount: {type: DataTypes.DECIMAL(16,2)},
        remark: {type: DataTypes.TEXT},
        shopId: {type: DataTypes.BIGINT},
        processedDate: {type: DataTypes.DATE},
        lastModifiedDate: {type: DataTypes.DATE},
        lastModifiedById: {type: DataTypes.BIGINT},
        createdById: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        paymentStatus: {type: DataTypes.INTEGER},
        status: {type: DataTypes.INTEGER},
        source: {type: DataTypes.INTEGER},
        ip: {type: DataTypes.STRING(100)}
      },
      {
        tableName: 'order',
        modelName: 'order',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.User, { foreignKey: 'lastModifiedById', as: 'lastModifiedBy' });
    this.belongsTo(models.Company, { foreignKey: 'partnerCompanyId', as: 'partnerCompany' });
    this.belongsTo(models.Person, { foreignKey: 'partnerPersonId', as: 'partnerPerson' });
    this.hasMany(models.OrderDetail, {
      foreignKey: 'orderId',
      as: 'details'
    });
    this.hasMany(models.TaggingItem, {
      foreignKey: 'itemId',
      as: 'taggingItems'
    });
  }
}

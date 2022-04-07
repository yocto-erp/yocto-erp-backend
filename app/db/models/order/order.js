import Sequelize, {Op} from 'sequelize';
import {TAGGING_TYPE} from "../tagging/tagging-item-type";
import User from "../user/user";
import {DEFAULT_INCLUDE_USER_ATTRS} from "../constants";

const {DataTypes} = Sequelize;

export const ORDER_TYPE = {
  SALE: 1,
  PURCHASE: 2
};

export const ORDER_STATUS = {}

export default class Order extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(150)},
        subjectId: {type: DataTypes.BIGINT},
        type: {type: DataTypes.TINYINT},
        companyId: {type: DataTypes.BIGINT},
        totalAmount: {type: DataTypes.DECIMAL(16, 2)},
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

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
    this.belongsTo(models.Subject, {foreignKey: 'subjectId', as: 'subject'});
    this.hasMany(models.OrderDetail, {
      foreignKey: 'orderId',
      as: 'details'
    });
    this.hasMany(models.TaggingItem, {
      foreignKey: 'itemId',
      as: 'taggingItems'
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.SALE_ORDER, TAGGING_TYPE.PURCHASE_ORDER]
          }
        },
        attributes: []
      },
      foreignKey: 'itemId',
      as: 'tagging'
    });
  }

  static defineScope(models) {
    this.addScope(
      'search', {
        include: [
          {
            model: models.User, as: 'createdBy',
            attributes: DEFAULT_INCLUDE_USER_ATTRS
          },
          {
            model: User, as: 'lastModifiedBy',
            attributes: DEFAULT_INCLUDE_USER_ATTRS
          },
          {model: models.Subject.scope('all'), as: 'subject'}
        ]
      })
  }
}

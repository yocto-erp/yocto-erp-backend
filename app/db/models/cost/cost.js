import Sequelize, {Op} from 'sequelize';
import {TAGGING_TYPE} from "../tagging/tagging-item-type";
import {DEFAULT_INCLUDE_USER_ATTRS} from "../constants";

const {DataTypes} = Sequelize;

export const COST_TYPE = Object.freeze({
  RECEIPT: 1,
  PAYMENT: 2
})

export default class Cost extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(250)},
        type: {type: DataTypes.TINYINT},
        amount: {type: DataTypes.DECIMAL(16, 2)},
        companyId: {type: DataTypes.BIGINT},
        createdById: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        processedDate: {type: DataTypes.DATE},
        lastModifiedDate: {type: DataTypes.DATE},
        lastModifiedById: {type: DataTypes.BIGINT},
        subjectId: {type: DataTypes.BIGINT},
        remark: {type: DataTypes.TEXT},
        paymentMethodId: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'cost',
        modelName: 'cost',
        timestamps: false,
        sequelize,
        ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.Subject, {foreignKey: 'subjectId', as: 'subject'});
    this.belongsToMany(models.Asset, {
      through: models.CostAsset,
      foreignKey: 'costId',
      otherKey: 'assetId',
      as: 'assets'
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.RECEIPT_VOUCHER, TAGGING_TYPE.PAYMENT_VOUCHER]
          }
        }
      },
      foreignKey: 'itemId',
      as: 'tagging'
    });
    this.hasMany(models.TaggingItem, {
      foreignKey: 'itemId',
      as: 'taggingItems'
    });
    this.hasMany(models.CostPurpose, {
      foreignKey: 'costId',
      as: 'costPurpose'
    });
    this.belongsTo(models.PaymentMethodSetting, {foreignKey: 'paymentMethodId', as: 'paymentMethod'});
  }

  static defineScope(models) {
    this.addScope(
      'search', {
        include: [
          {
            model: models.User, as: 'createdBy',
            attributes: DEFAULT_INCLUDE_USER_ATTRS
          },
          {model: models.Subject.scope('all'), as: 'subject'},
          {model: models.PaymentMethodSetting, as: 'paymentMethod'}
        ]
      })
  }
}

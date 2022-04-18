import Sequelize from 'sequelize';
import { TAGGING_TYPE } from '../tagging/tagging-item-type';
import { DEFAULT_INCLUDE_USER_ATTRS } from '../constants';

const {DataTypes} = Sequelize;

export const DEBT_TYPE = {
  RECEIVABLES: 1, // Khách hàng nợ
  TO_PAY_DEBT: 2, // Công ty nợ
  RECOVERY_PUBLIC_DEBT: 3, // Thu nợ khách hàng
  PAID_DEBT: 4 // Công ty trả nợ
}

export default class Debt extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        subjectId: {type: DataTypes.BIGINT},
        name: {type: DataTypes.STRING(255)},
        companyId: {type: DataTypes.BIGINT},
        amount: {type: DataTypes.DECIMAL(12, 2)},
        createdDate: {type: DataTypes.DATE},
        createdById: {type: DataTypes.BIGINT},
        type: {type: DataTypes.INTEGER},
        remark: {type: DataTypes.TEXT},
        settleDebtId: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'debt',
        modelName: 'debt',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.Debt, {foreignKey: 'settleDebtId', as: 'settleDebt'});
    this.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject'
    });
    this.hasMany(models.DebtDetail, {
      foreignKey: 'debtId',
      as: 'details'
    });
    this.hasMany(models.TaggingItem, {
      foreignKey: "itemId",
      as: "taggingItems"
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: TAGGING_TYPE.DEBT
        }
      },
      foreignKey: "itemId",
      otherKey: "taggingId",
      as: "tagging"
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
          {model: models.Subject.scope('all'), as: 'subject'}
        ]
      })
  }
}

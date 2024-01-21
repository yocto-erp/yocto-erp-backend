import Sequelize from 'sequelize';
import { ASSET_ITEM_TYPE } from '../asset/asset-item';

const { DataTypes } = Sequelize;

export const FormRegisterStatus = {
  REQUEST: 1,
  CONFIRMED: 2,
  PAID: 3,
  CANCEL: 4
};

export default class FormRegister extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        publicId: { type: DataTypes.STRING(64) },
        ip: { type: DataTypes.STRING(100) },
        userAgent: { type: DataTypes.TEXT },
        userId: { type: DataTypes.BIGINT },
        registerData: { type: DataTypes.JSON },
        createdDate: { type: DataTypes.DATE },
        totalAmount: { type: DataTypes.DECIMAL(14, 2) },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT },
        isConfirmed: { type: DataTypes.BOOLEAN }, // in case need confirm via email, depend on setting,
        status: { type: DataTypes.INTEGER },
        formId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING(100) },
        phone: { type: DataTypes.STRING(20) },
        email: { type: DataTypes.STRING(150) }
      },
      {
        tableName: 'form_register',
        modelName: 'formRegister',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'createdBy' });
    this.belongsTo(models.Form, { foreignKey: 'formId', as: 'form' });
    this.belongsToMany(models.PaymentRequest, {
      through: {
        model: models.FormRegisterPayment
      },
      foreignKey: "formRegisterId",
      otherKey: "paymentRequestId",
      as: "payments"
    });
  }
}

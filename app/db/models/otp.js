import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const OTP_TARGET_TYPE = {
  EMAIL: 1,
  SMS: 2
}

export const OTP_STATUS = {
  PENDING: 1,
  VERIFY: 2
}

export default class OTP extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        clientId: {type: DataTypes.STRING(64), primaryKey: true},
        code: {type: DataTypes.STRING(64), primaryKey: true},
        createdDate: {type: DataTypes.DATE},
        expiredDate: {type: DataTypes.DATE},
        verifiedDate: {type: DataTypes.DATE},
        status: {type: DataTypes.INTEGER},
        target: {type: DataTypes.STRING(100), primaryKey: true},
        targetType: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'otp',
        modelName: 'otp',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

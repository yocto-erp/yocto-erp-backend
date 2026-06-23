import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const CHALLENGE_STATUS = {
  AVAILABLE: 1,
  CONFIRMED: 2
};

export const CHALLENGE_ACTION = {
  LOGIN: 1
};

export default class Challenge extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        publicId: { type: DataTypes.STRING(64) },
        createdDate: { type: DataTypes.DATE },
        expiredDate: { type: DataTypes.DATE },
        status: { type: DataTypes.TINYINT },
        action: { type: DataTypes.TINYINT },
        confirmedOn: { type: DataTypes.DATE },
        ip: { type: DataTypes.STRING(256) },
        userAgent: { type: DataTypes.TEXT }
      },
      {
        tableName: 'challenge',
        modelName: 'challenge',
        timestamps: false,
        sequelize, ...opts
      });
  }
}

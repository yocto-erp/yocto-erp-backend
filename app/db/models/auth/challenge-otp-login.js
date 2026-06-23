import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class ChallengeOtpLogin extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        challengeId: { type: DataTypes.INTEGER, primaryKey: true },
        email: { type: DataTypes.STRING(150) },
        userId: { type: DataTypes.INTEGER, allowNull: true }
      },
      {
        tableName: 'challenge_otp_login',
        modelName: 'challengeOTPLogin',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Challenge, {
      foreignKey: 'challengeId',
      as: 'challenge'
    });
    this.hasOne(models.ChallengeOTP, {
      foreignKey: 'challengeId',
      as: 'challengeOTP',
      sourceKey: 'challengeId'
    });
  }
}

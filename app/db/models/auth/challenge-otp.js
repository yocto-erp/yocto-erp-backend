import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;


export default class ChallengeOTP extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        challengeId: { type: DataTypes.INTEGER, primaryKey: true },
        code: { type: DataTypes.STRING(225) },
        totalSent: { type: DataTypes.INTEGER },
        lastSent: { type: DataTypes.DATE }
      },
      {
        tableName: 'challenge_otp',
        modelName: 'challengeOTP',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Challenge, {
      foreignKey: 'challengeId',
      as: 'challenge'
    });
  }
}

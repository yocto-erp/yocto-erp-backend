import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class UserResetPassword extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: { type: DataTypes.INTEGER },
        token: { type: DataTypes.INTEGER },
        confirmed: { type: DataTypes.BOOLEAN },
        expired_time: { type: DataTypes.DATE },
        date_inserted: { type: DataTypes.DATE }
      },
      {
        tableName: 'user_reset_password',
        modelName: 'user_reset_password',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }
}

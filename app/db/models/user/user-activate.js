import Sequelize from "sequelize";

const { DataTypes } = Sequelize;


export default class UserActivate extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.BIGINT },
        active_code: { type: DataTypes.STRING(64) },
        date_inserted: { type: DataTypes.DATE },
        isConfirmed: { type: DataTypes.BOOLEAN },
        confirmedDate: { type: DataTypes.DATE },
        lastResentDate: { type: DataTypes.DATE }
      },
      {
        tableName: "user_activate",
        modelName: "userActivate",
        timestamps: false,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  }
}

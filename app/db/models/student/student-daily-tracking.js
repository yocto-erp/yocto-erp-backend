import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class StudentDailyTracking extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      companyId: { type: DataTypes.BIGINT },
      trackingDate: { type: DataTypes.DATE },
      studentId: { type: DataTypes.BIGINT },
      fromBusId: { type: DataTypes.BIGINT },
      checkInDate: { type: DataTypes.DATE },
      checkInWithId: { type: DataTypes.BIGINT },
      checkInSignatureId: { type: DataTypes.BIGINT },
      checkInIP: { type: DataTypes.STRING(100) },
      checkInDeviceId: { type: DataTypes.STRING(100) },
      checkInCoordinate: { type: DataTypes.GEOMETRY("POINT") },
      checkInRemark: { type: DataTypes.TEXT },
      toBusId: { type: DataTypes.BIGINT },
      checkOutDate: { type: DataTypes.DATE },
      checkOutWithId: { type: DataTypes.BIGINT },
      checkOutSignatureId: { type: DataTypes.BIGINT },
      checkOutIP: { type: DataTypes.STRING(100) },
      checkOutDeviceId: { type: DataTypes.STRING(100) },
      checkOutCoordinate: { type: DataTypes.GEOMETRY("POINT") },
      checkOutRemark: { type: DataTypes.TEXT },
      lastModifiedDate: { type: DataTypes.DATE },
      checkInUserAgent: { type: DataTypes.TEXT },
      checkOutUserAgent: { type: DataTypes.TEXT }
    }, {
      tableName: "student_daily_tracking",
      modelName: "studentDailyTracking",
      timestamps: false,
      sequelize, ...opts
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "checkInWithId", as: "checkInWith" });
    this.belongsTo(models.User, { foreignKey: "checkOutWithId", as: "checkOutWith" });
    this.belongsTo(models.Asset, { foreignKey: "checkInSignatureId", as: "checkInSignature" });
    this.belongsTo(models.Asset, { foreignKey: "checkOutSignatureId", as: "checkOutSignature" });
    this.belongsTo(models.StudentBusStop, { foreignKey: "fromBusId", as: "checkInFromBus" });
    this.belongsTo(models.StudentBusStop, { foreignKey: "toBusId", as: "checkOutAtBus" });
  }
}

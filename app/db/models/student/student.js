import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Student extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
      personId: {type: DataTypes.BIGINT},
      companyId: {type: DataTypes.BIGINT},
      studentId: {type: DataTypes.BIGINT},
      alias: {type: DataTypes.STRING(150)},
      fatherId: {type: DataTypes.BIGINT},
      motherId: {type: DataTypes.BIGINT},
      feePackage: {type: DataTypes.TINYINT},
      scholarShip: {type: DataTypes.DECIMAL(5, 2)},
      enableBus: {type: DataTypes.BOOLEAN},
      toSchoolBusRoute: {type: DataTypes.STRING(100)},
      toHomeBusRoute: {type: DataTypes.STRING(100)},
      enableMeal: {type: DataTypes.BOOLEAN},
      class: {type: DataTypes.STRING(100)},
      joinDate: {type: DataTypes.DATE},
      status: {type: DataTypes.TINYINT},
      lastModifiedDate: {type: DataTypes.DATE},
      lastModifiedById: {type: DataTypes.BIGINT},
      createdById: {type: DataTypes.BIGINT},
      createdDate: {type: DataTypes.DATE},
      busStopId: {type: DataTypes.BIGINT},
      classId: {type: DataTypes.BIGINT}
    }, {
      tableName: 'student',
      modelName: 'student',
      timestamps: false,
      sequelize, ...opts
    })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
    this.belongsTo(models.Person, {foreignKey: 'personId', as: 'child'});
    this.belongsTo(models.Person, {foreignKey: 'fatherId', as: 'father'});
    this.belongsTo(models.Person, {foreignKey: 'motherId', as: 'mother'});
  }
}

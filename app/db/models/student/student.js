import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const MAIN_CONTACT_TYPE = {
  MOTHER: 1,
  FATHER: 2
}

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
      joinDate: {type: DataTypes.DATE},
      status: {type: DataTypes.TINYINT},
      lastModifiedDate: {type: DataTypes.DATE},
      lastModifiedById: {type: DataTypes.BIGINT},
      createdById: {type: DataTypes.BIGINT},
      createdDate: {type: DataTypes.DATE},
      toSchoolBusStopId: {type: DataTypes.BIGINT},
      toHomeBusStopId: {type: DataTypes.BIGINT},
      classId: {type: DataTypes.BIGINT},
      mainContact: {type: DataTypes.TINYINT},
      subjectId: {type: DataTypes.BIGINT}
    }, {
      tableName: 'student',
      modelName: 'student',
      timestamps: false,
      sequelize, ...opts
    })
  }

  static associate(models) {
    this.belongsTo(models.StudentClass, {foreignKey: 'classId', as: 'class'});
    this.belongsTo(models.StudentBusStop, {foreignKey: 'toSchoolBusStopId', as: 'toSchoolBusStop'});
    this.belongsTo(models.StudentBusStop, {foreignKey: 'toHomeBusStopId', as: 'toHomeBusStop'});
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
    this.belongsTo(models.Person, {foreignKey: 'personId', as: 'child'});
    this.belongsTo(models.Person, {foreignKey: 'fatherId', as: 'father'});
    this.belongsTo(models.Person, {foreignKey: 'motherId', as: 'mother'});
    this.belongsTo(models.DebtSubjectBalance, {foreignKey: "subjectId", as: "debt"})
  }
}

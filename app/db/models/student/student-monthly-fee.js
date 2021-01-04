import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class StudentMonthlyFee extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
      studentId: {type: DataTypes.BIGINT},
      companyId: {type: DataTypes.BIGINT},
      monthFee: {type: DataTypes.INTEGER},
      yearFee: {type: DataTypes.INTEGER},
      scholarShip: {type: DataTypes.DECIMAL(5, 2)},
      scholarFee: {type: DataTypes.DECIMAL(12, 2)},
      mealFee: {type: DataTypes.DECIMAL(12, 2)},
      absentDay: {type: DataTypes.INTEGER},
      absentDayFee: {type: DataTypes.DECIMAL(12, 2)},
      deduceTuition: {type: DataTypes.DECIMAL(12, 2)},
      busFee: {type: DataTypes.DECIMAL(12, 2)},
      beginningYearFee: {type: DataTypes.DECIMAL(12, 2)},
      otherFee: {type: DataTypes.DECIMAL(12, 2)},
      otherDeduceFee: {type: DataTypes.DECIMAL(12, 2)},
      debt: {type: DataTypes.DECIMAL(12, 2)},
      remark: {type: DataTypes.TEXT},
      status: {type: DataTypes.TINYINT},
      paidDate: {type: DataTypes.DATE},
      paidInformation: {type: DataTypes.TEXT},
      paidAmount: {type: DataTypes.DECIMAL(12, 2)},
      sentToParent: {type: DataTypes.BOOLEAN},
      emailId: {type: DataTypes.BIGINT},
      trialDate: {type: DataTypes.INTEGER},
      trialDateFee: {type: DataTypes.DECIMAL(12, 2)},
      feePerMonth: {type: DataTypes.DECIMAL(12, 2)},
      totalAmount: {type: DataTypes.DECIMAL(12, 2)},
      lastUpdatedDate: {type: DataTypes.DATE},
      lastUpdatedById: {type: DataTypes.INTEGER},
      studentAbsentDay: {type: DataTypes.INTEGER},
      studentAbsentDayFee: {type: DataTypes.DECIMAL(12, 2)},
      costId: {type: DataTypes.BIGINT}
    }, {
      tableName: 'student_monthly_fee',
      modelName: 'studentMonthlyFee',
      timestamps: false,
      sequelize, ...opts
    })
  }

  static associate(models) {
    this.belongsTo(models.Student, {foreignKey: 'studentId', as: 'student'});
    this.belongsTo(models.Cost, {foreignKey: 'costId', as: 'payment'});
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class StudentClass extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
      companyId: {type: DataTypes.BIGINT},
      name: {type: DataTypes.STRING(256)},
      tuitionFeePerMonth: {type: DataTypes.DECIMAL(12, 2)},
      absentFeeReturnPerDay: {type: DataTypes.DECIMAL(12, 2)},
      feePerTrialDay: {type: DataTypes.DECIMAL(10, 2)},
      mealFeePerMonth: {type: DataTypes.DECIMAL(12, 2)},
      mealFeeReturnPerDay: {type: DataTypes.DECIMAL(10, 2)},
      lastModifiedDate: {type: DataTypes.DATE},
      lastModifiedById: {type: DataTypes.BIGINT}
    }, {
      tableName: 'student_class',
      modelName: 'studentClass',
      timestamps: false,
      sequelize, ...opts
    })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
  }
}

import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class StudentJoinClass extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      studentId: { type: DataTypes.BIGINT, primaryKey: true },
      classId: { type: DataTypes.BIGINT, primaryKey: true },
      createdDate: { type: DataTypes.DATE }
    }, {
      tableName: 'student_join_class',
      modelName: 'studentJoinClass',
      timestamps: false,
      sequelize, ...opts
    });
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    this.belongsTo(models.StudentClass, { foreignKey: 'classId', as: 'clazz' });
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class StudentBusStop extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init({
      id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
      companyId: {type: DataTypes.BIGINT},
      name: {type: DataTypes.STRING(256)},
      lastModifiedDate: {type: DataTypes.DATE},
      lastModifiedById: {type: DataTypes.BIGINT}
    }, {
      tableName: 'student_bus_stop',
      modelName: 'studentBusStop',
      timestamps: false,
      sequelize, ...opts
    })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
  }
}

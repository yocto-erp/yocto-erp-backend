import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class ShiftWork extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        name: {type: DataTypes.STRING(250)},
        fromTime: {type: DataTypes.TIME},
        toTime: {type: DataTypes.TIME},
        remark: { type: DataTypes.TEXT}
      },
      {
        tableName: 'shift-work',
        modelName: 'shift-work',
        timestamps : false,
        sequelize, ...opts
      })
  }
  static associate(models) {
    // this.belongsTo(models.User, {foreignKey: '', as: ''});
    // this.belongsTo(models.Person, {foreignKey: '', as: ''});

  }
}

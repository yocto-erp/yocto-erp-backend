import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Employee extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        personId: {type: DataTypes.BIGINT},
        startedDate: {type: DataTypes.DATE},
        salary: {type: DataTypes.DECIMAL(16, 2)},
        bio: {type: DataTypes.TEXT},
        createdById: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'employee',
        modelName: 'employee',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.Person, {foreignKey: 'personId', as: 'person'});

  }
}


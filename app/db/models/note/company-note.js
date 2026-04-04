import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CompanyNote extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        noteId: {type: DataTypes.INTEGER, primaryKey: true}
      },
      {
        tableName: 'company_note',
        modelName: 'companyNote',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Note, {foreignKey: 'noteId', as: 'note'});
  }

}

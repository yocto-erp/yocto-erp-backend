import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;


export default class Note extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        title: {type: DataTypes.STRING},
        note: {type: DataTypes.TEXT},
        createdDate: {type: DataTypes.DATE},
        createdById: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'note',
        modelName: 'note',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsToMany(models.Asset, {
      through: models.NoteAsset,
      foreignKey: "noteId",
      otherKey: "assetId",
      as: "assets"
    });
  }
}

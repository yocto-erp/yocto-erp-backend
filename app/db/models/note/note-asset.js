import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class NoteAsset extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        assetId: {type: DataTypes.BIGINT, primaryKey: true},
        noteId: {type: DataTypes.INTEGER, primaryKey: true}
      },
      {
        tableName: 'note_asset',
        modelName: 'noteAsset',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
  }

}

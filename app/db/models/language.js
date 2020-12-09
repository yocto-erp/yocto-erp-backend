import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const LANGUAGE = [
  { id: 1, code: 'en', name: 'English' },
  { id: 2, code: 'ja', name: 'Japanese' },
  { id: 3, code: 'vn', name: 'Vietnamese' }
];

export default class Language extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true},
        name: {type: DataTypes.STRING(250)}
      },
      {
        tableName: 'language',
        modelName: 'language',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TaggingItemType extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        name: {type: DataTypes.STRING(150)}
      },
      {
        tableName: 'tagging_item_type',
        modelName: 'taggingItemType',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

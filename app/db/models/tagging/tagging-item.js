import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TaggingItem extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        taggingId: {type: DataTypes.BIGINT, primaryKey: true},
        itemType: {type: DataTypes.BIGINT, primaryKey: true},
        itemId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'tagging_item',
        modelName: 'taggingItem',
        timestamps: false,
        sequelize, ...opts
      })
  }
}

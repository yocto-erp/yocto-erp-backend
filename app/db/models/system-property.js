import Sequelize from 'sequelize';

export const TYPE = Object.freeze({
  STRING: 'string',
  NUMBER: 'number',
  JSON: 'json'
});

const {DataTypes} = Sequelize;

export default class SystemProperty extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          primaryKey: true
        },
        value: {type: DataTypes.TEXT},
        type: {type: DataTypes.TEXT(20)}
      },
      {
        tableName: 'system_property',
        modelName: 'system_property',
        timestamps: false, ...opts,
        sequelize
      }
    );
  }
}

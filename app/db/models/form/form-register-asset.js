import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class FormRegisterAsset extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        formRegisterId: { type: DataTypes.INTEGER, primaryKey: true },
        formAssetId: { type: DataTypes.INTEGER, primaryKey: true }
      },
      {
        tableName: 'form_register_asset',
        modelName: 'formRegisterAsset',
        timestamps: false,
        sequelize, ...opts
      });
  }


  static associate(models) {
    this.belongsTo(models.Form, { foreignKey: 'formRegisterId', as: 'form' });
  }
}

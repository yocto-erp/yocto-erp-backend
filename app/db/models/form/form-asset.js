import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const FormAssetType = {
  CLASS: 1,
  PRODUCT: 2
};

export default class FormAsset extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        formId: { type: DataTypes.INTEGER, primaryKey: true },
        id: { type: DataTypes.INTEGER, primaryKey: true },
        type: { type: DataTypes.TINYINT },
        relativeId: { type: DataTypes.INTEGER }
      },
      {
        tableName: 'form_asset',
        modelName: 'formAsset',
        timestamps: false,
        sequelize, ...opts
      });
  }


  static associate(models) {
    this.belongsTo(models.StudentClass, {
      foreignKey: 'relativeId', as: 'class', scope: {
        type: FormAssetType.CLASS
      }
    });
    this.belongsTo(models.EcommerceProduct, {
      foreignKey: 'relativeId', as: 'product', scope: {
        type: FormAssetType.PRODUCT
      }
    });
  }
}

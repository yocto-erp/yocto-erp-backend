import Product from "./product";
import ProductAsset from "./product-asset";
import ProductUnit from "./product-unit";
import ProductItem from "./product-item";

export const initProductModel = sequelize => ({
  Product: Product.init(sequelize),
  ProductAsset: ProductAsset.init(sequelize),
  ProductUnit: ProductUnit.init(sequelize),
  ProductItem: ProductItem.init(sequelize)
});

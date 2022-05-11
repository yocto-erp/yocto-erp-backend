import Provider from "./provider";
import ProviderProduct from "./provider-product";

export const initProviderModel = sequelize => ({
  Provider: Provider.init(sequelize),
  ProviderProduct: ProviderProduct.init(sequelize)
});

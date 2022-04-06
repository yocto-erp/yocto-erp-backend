import AssetIpfs from "./asset-ipfs";
import Asset from "./asset";
import AssetItem from "./asset-item";

export const initAssetModel = sequelize => ({
  AssetIpfs: AssetIpfs.init(sequelize),
  Asset: Asset.init(sequelize),
  AssetItem: AssetItem.init(sequelize)
});

/**
 * https://web3.storage/docs/reference/js-client-library#return-value
 */
import { Web3Storage } from "web3.storage";
import { getFilesFromPath } from "files-from-path";
import { filterFileExisted } from "./file.service";

export const IPFS_STATUS = {
  PINNED: "Pinned",
  PINNING: "Pinning",
  PIN_QUEUED: "PinQueued"
};

export const DEAL_STATUS = {
  QUEUED: "Queued",
  PUBLISHED: "Published",
  ACTIVE: "Active"
};

const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
/**
 * Check asset file is existed on hard disk, and upload to web3Storage, and update to asset_ipfs
 * @param listFiles
 */
export const uploadToIPFSFiles = async (listFiles) => {
  const files = await filterFileExisted(listFiles);
  const uploadIPFSFiles = await getFilesFromPath(files);
  return client.put(uploadIPFSFiles);
};

export const getCIDIpfsStatus = (cid) => {
  return client.status(cid);
};

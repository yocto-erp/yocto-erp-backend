import { Op } from "sequelize";
import db from "../../db/models";
import { sendErrorMessage } from "../partner/telegram";
import { ASSET_SYNC_STATUS, ASSET_TYPE } from "../../db/models/asset/asset";
import { DEAL_STATUS, getCIDIpfsStatus, IPFS_STATUS, uploadToIPFSFiles } from "../file/ipfs.service";
import { schedulerLog } from "../../config/winston";

export const cronJobUploadIPFS = async () => {
  const listAsset = await db.Asset.findAll({
    where: {
      [Op.or]: [
        {
          syncStatus: {
            [Op.in]: [ASSET_SYNC_STATUS.PENDING, ASSET_SYNC_STATUS.FAIL]
          }
        },
        { syncStatus: null }
      ],
      type: ASSET_TYPE.FILE
    },
    limit: 50,
    order: [["id", "asc"]]
  });
  try {
    schedulerLog.info("Upload to IPFS num of files ", listAsset.length || 0);
    if (listAsset.length) {
      await db.Asset.update({
        syncStatus: ASSET_SYNC_STATUS.PROCESSING
      }, {
        where: {
          id: {
            [Op.in]: listAsset.map(t => t.id)
          }
        },
        fields: ["syncStatus"]
      });
      const listFilesId = listAsset.map(t => t.fileId);
      console.log("listFile", listFilesId);
      const cid = await uploadToIPFSFiles(listFilesId);
      if (cid && cid.length) {
        const transaction = await db.sequelize.transaction();
        try {
          const newIpfs = await db.AssetIpfs.create({
            carId: cid,
            lastModifiedDate: new Date(),
            totalPinned: 0,
            totalDeal: 0
          }, { transaction });
          await db.Asset.update({
            syncStatus: ASSET_SYNC_STATUS.SUCCESS,
            ipfsId: newIpfs.id,
            lastModifiedDate: new Date(),
            lastSynced: new Date()
          }, {
            where: {
              id: {
                [Op.in]: listAsset.map(t => t.id)
              }
            },
            fields: ["syncStatus", "ipfsId", "lastModifiedDate"],
            transaction
          });
          await transaction.commit();
        } catch (e) {
          await transaction.rollback();
          throw e;
        }
      } else {
        await db.Asset.update({
          syncStatus: ASSET_SYNC_STATUS.FAIL,
          lastSynced: new Date(),
          lastModifiedDate: new Date()
        }, {
          where: {
            id: {
              [Op.in]: listAsset.map(t => t.id)
            }
          },
          fields: ["syncStatus", "lastSynced", "lastModifiedDate"]
        });
      }
    }
  } catch (e) {
    if (listAsset.length) {
      await db.Asset.update({
        syncStatus: ASSET_SYNC_STATUS.FAIL
      }, {
        where: {
          id: {
            [Op.in]: listAsset.map(t => t.id)
          }
        },
        fields: ["syncStatus"]
      });
    }
    sendErrorMessage(e.stack).then();
  }
};

const updateIPFSStatus = async (ipfs) => {
  try {
    const status = await getCIDIpfsStatus(ipfs.carId);
    ipfs.totalPinned = status.pins.filter(t => t.status === IPFS_STATUS.PINNED).length;
    ipfs.totalDeal = status.deals.filter(t => t.status === DEAL_STATUS.ACTIVE).length;
    ipfs.lastUpdatedStatus = new Date();
    ipfs.lastModifiedDate = new Date();
    await ipfs.save();
  } catch (e) {
    sendErrorMessage(e.stack);
  }
};

export const cronJobUpdateIPFSStatus = async () => {
  const listIPFS = await db.AssetIpfs.findAll({
    where: {
      totalPinned: {
        [Op.lte]: 2
      }
    },
    order: [["id", "asc"]],
    limit: 20
  });
  console.log("Found ipfs need to update status: ", listIPFS.length);
  if (listIPFS.length) {
    listIPFS.forEach(t => updateIPFSStatus(t));
  }
};

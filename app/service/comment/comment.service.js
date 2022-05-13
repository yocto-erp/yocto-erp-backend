import db from "../../db/models";
import { isArrayHasLength } from "../../util/func.util";
import { ASSET_ITEM_TYPE } from "../../db/models/asset/asset-item";
import { badRequest, FIELD_ERROR } from "../../config/error";

export function listComment(user, purpose, relativeId, paging) {
  return db.Comment.findAndCountAll({
    where: {
      relativeType: purpose,
      companyId: user.companyId,
      relativeId
    },
    include: [
      {
        model: db.Asset, as: "assets", include: [
          { model: db.AssetIpfs, as: "ipfs" }
        ]
      },
      { model: db.User, as: "createdBy" }
    ],
    group: ["id"],
    ...paging
  }).then(t => ({
    rows: t.rows,
    count: t.count.length
  }));
}

export async function addComment(user, purpose, relativeId, { message, assets }) {
  const transaction = await db.sequelize.transaction();

  try {
    const newComment = await db.Comment.create({
      companyId: user.companyId,
      message,
      createdDate: new Date(),
      createdById: user.id,
      relativeType: purpose,
      relativeId
    }, { transaction });
    if (isArrayHasLength(assets)) {
      await db.AssetItem.bulkCreate(
        assets.map((t, i) => {
          return {
            assetId: t.id,
            assetItemType: ASSET_ITEM_TYPE.COMMENT,
            itemId: newComment.id,
            priority: i + 1
          };
        }),
        { transaction }
      );
    }
    await transaction.commit();
    return newComment;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function getComment(user, purpose, relativeId, cid) {
  const existed = await db.Comment.findOne({
    where: {
      relativeType: purpose,
      companyId: user.companyId,
      relativeId,
      id: cid
    },
    include: [
      { model: db.Asset, as: "assets" },
      { model: db.User, as: "createdBy" }
    ]
  });
  if (!existed) {
    throw badRequest("comment", FIELD_ERROR.INVALID, "Comment not found");
  }
}

export async function removeComment(user, purpose, relativeId, cid) {
  const existed = await getComment(user, purpose, relativeId, cid);
  const transaction = await db.sequelize.transaction();
  try {
    if (isArrayHasLength(existed.assets)) {
      if (isArrayHasLength(existed.assets)) {
        await db.AssetItem.destroy({
          where: {
            assetItemType: ASSET_ITEM_TYPE.COMMENT,
            itemId: existed.id
          }
        }, { transaction });
      }
    }
    await existed.destroy({ transaction });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

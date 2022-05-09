import db from "../../db/models";
import { ASSET_TYPE } from "../../db/models/asset/asset";
import { SYSTEM_STATUS } from "../../db/models/constants";

export async function getUserProfile(user) {
  return db.User.findOne({
    where: {
      id: user.id
    },
    include: [
      { model: db.Person, as: "person" },
      {
        model: db.Asset, as: "avatar", include: [
          { model: db.AssetIpfs, as: "ipfs" }
        ]
      }
    ]
  });
}

export async function updateUserProfile(user, form, avatar) {
  console.log(avatar)
  const { fullName, phone } = form;
  const existed = await getUserProfile(user);
  const transaction = await db.sequelize.transaction();
  let newAvatar = null;
  try {
    if (avatar) {
      newAvatar = await db.Asset.create({
        name: avatar.originalname,
        type: ASSET_TYPE.FILE,
        size: avatar.size,
        fileId: avatar.filename,
        companyId: user.companyId,
        mimeType: avatar.mimetype,
        createdById: user.id,
        createdDate: new Date()
      }, { transaction });
      if (existed.avatar) {
        existed.avatar.systemStatus = SYSTEM_STATUS.DELETED;
        existed.avatar.lastModifiedDate = new Date();
        await existed.avatar.save({ transaction });
      }

      existed.avatarId = newAvatar.id;
    }

    const infos = fullName.split(" ");
    const lastName = infos.length > 1 ? infos[infos.length - 1] : infos[0];
    const firstName = infos.length > 1 ? infos.slice(0, -1).join(" ") : "";
    if (existed.person) {
      existed.person.fullName = fullName;
      existed.person.lastName = lastName;
      existed.person.firstName = firstName;
      existed.person.gsm = phone;
      existed.person.lastModifiedDate = new Date();
      await existed.person.save({ transaction });
    } else {
      const newPerson = await db.Person.create({
        firstName,
        lastName,
        fullName,
        email: existed.email,
        gsm: phone,
        createdById: 0,
        createdDate: new Date()
      }, { transaction });
      existed.personId = newPerson.id;
    }
    existed.displayName = fullName;
    await existed.save({ transaction });
    await transaction.commit();
    return { displayName: existed.displayName, newAvatar };
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

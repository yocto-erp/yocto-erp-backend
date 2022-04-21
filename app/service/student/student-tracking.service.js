import db from "../../db/models";
import { DEFAULT_TIMEZONE, getStartDateUtcOfTimezoneDate } from "../../util/date.util";
import { hasText } from "../../util/string.util";
import { STUDENT_STATUS } from "../../db/models/student/student";
import { storeFileFromBase64 } from "../file/storage.service";
import { ASSET_TYPE } from "../../db/models/asset/asset";

const { Op } = db.Sequelize;

export async function getListStudentTracking(user, { date, bus, search }) {
  const where = {
    companyId: user.companyId,
    status: STUDENT_STATUS.ACTIVE,
    enableBus: true
  };
  const whereTracking = {};

  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  let searchDate = new Date();
  if (hasText(date)) {
    searchDate = new Date(date);
  }
  whereTracking.trackingDate = getStartDateUtcOfTimezoneDate(searchDate, countryTz);

  if (hasText(bus)) {
    where[Op.or] = [
      {
        toHomeBusStopId: bus
      }, {
        toSchoolBusStopId: bus
      }
    ];
  }
  if (hasText(search)) {
    where[Op.or] = [
      {
        alias: {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$child.fullName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$father.fullName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$mother.fullName$": {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  return db.Student.findAll({
    where,
    include: [
      { model: db.Person, as: "child" },
      { model: db.Person, as: "father" },
      { model: db.Person, as: "mother" },
      { model: db.StudentBusStop, as: "toSchoolBusStop" },
      { model: db.StudentBusStop, as: "toHomeBusStop" },
      {
        required: false,
        model: db.StudentDailyTracking, as: "tracking", where: whereTracking,
        include: [
          {
            model: db.Asset, as: "checkInSignature", include: [
              { model: db.AssetIpfs, as: "ipfs" }
            ]
          },
          {
            model: db.Asset, as: "checkOutSignature", include: [
              { model: db.AssetIpfs, as: "ipfs" }
            ]
          },
          { model: db.StudentBusStop, as: "checkInFromBus" },
          { model: db.StudentBusStop, as: "checkOutAtBus" }
        ]
      }
    ],
    order: [["alias", "asc"]]
  });
}

const SIGN_TYPE = {
  CHECK_IN: 1,
  CHECK_OUT: 2
};

export async function sign(user, form, ip, deviceId, userAgent) {
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  const { date, type, signature, bus, studentId, lng, lat } = form;
  const dateObj = getStartDateUtcOfTimezoneDate(new Date(date), countryTz);
  let studentTracking = await db.StudentDailyTracking.findOne({
    where: {
      studentId, trackingDate: dateObj, companyId: user.companyId
    }
  });
  const fromBusId = Number(type) === SIGN_TYPE.CHECK_IN ? bus : 0;
  const toBusId = Number(type) === SIGN_TYPE.CHECK_OUT ? bus : 0;
  const storeSignatureFile = storeFileFromBase64(signature);
  const transaction = await db.sequelize.transaction();
  try {
    const newAsset = await db.Asset.create({
      name: `Signature ${storeSignatureFile}`,
      type: ASSET_TYPE.FILE,
      size: signature.length,
      fileId: storeSignatureFile,
      companyId: user.companyId,
      mimeType: "image/png",
      createdById: user.id,
      createdDate: new Date()
    }, { transaction });
    const checkInSignatureId = Number(type) === SIGN_TYPE.CHECK_IN ? newAsset.id : null;
    const checkOutSignatureId = Number(type) === SIGN_TYPE.CHECK_OUT ? newAsset.id : null;
    const checkInIP = Number(type) === SIGN_TYPE.CHECK_IN ? ip : "";
    const checkOutIP = Number(type) === SIGN_TYPE.CHECK_OUT ? ip : "";
    const checkInDeviceId = Number(type) === SIGN_TYPE.CHECK_IN ? deviceId : "";
    const checkOutDeviceId = Number(type) === SIGN_TYPE.CHECK_OUT ? deviceId : "";
    const checkInUserAgent = Number(type) === SIGN_TYPE.CHECK_IN ? userAgent : null;
    const checkOutUserAgent = Number(type) === SIGN_TYPE.CHECK_OUT ? userAgent : null;
    const checkInDate = Number(type) === SIGN_TYPE.CHECK_IN ? new Date() : null;
    const checkOutDate = Number(type) === SIGN_TYPE.CHECK_OUT ? new Date() : null;
    const checkInWithId = Number(type) === SIGN_TYPE.CHECK_IN ? user.id : null;
    const checkOutWithId = Number(type) === SIGN_TYPE.CHECK_OUT ? user.id : null;
    if (!studentTracking) {
      studentTracking = await db.StudentDailyTracking.create({
        companyId: user.companyId,
        trackingDate: dateObj,
        studentId,
        fromBusId,
        checkInDate,
        checkInWithId,
        checkInSignatureId,
        checkInIP,
        checkInDeviceId,
        toBusId,
        checkOutDate,
        checkOutWithId,
        checkOutSignatureId,
        checkOutIP,
        checkOutDeviceId,
        checkInUserAgent,
        checkOutUserAgent
      }, { transaction });
    } else if (Number(type) === SIGN_TYPE.CHECK_IN) {
      await studentTracking.update({
        fromBusId,
        checkInDate,
        checkInWithId,
        checkInSignatureId,
        checkInIP,
        checkInUserAgent,
        checkInDeviceId,
        lastModifiedDate: new Date()
      }, { transaction });
    } else {
      await studentTracking.update({
        toBusId,
        checkOutDate,
        checkOutWithId,
        checkOutSignatureId,
        checkOutIP,
        checkOutDeviceId,
        lastModifiedDate: new Date(),
        checkOutUserAgent
      }, { transaction });
    }

    await transaction.commit();
    return studentTracking;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

}

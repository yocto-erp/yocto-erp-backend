import db from "../../db/models";
import {
  DEFAULT_TIMEZONE,
  getStartDateUtcOfTimezoneDate
} from "../../util/date.util";
import { hasText } from "../../util/string.util";
import { STUDENT_STATUS } from "../../db/models/student/student";
import { storeFileFromBase64 } from "../file/storage.service";
import { ASSET_TYPE } from "../../db/models/asset/asset";
import { buildDateTimezoneRangeQuery } from "../../util/db.util";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";
import { STUDENT_DAILY_STATUS } from "../../db/models/student/student-daily-tracking";

const { Op } = db.Sequelize;

const BUS_DIRECTION = {
  GO: 1,
  BACK: 2
};

export async function dailyTrackingSummary(user, { date, direction }) {
  const where = {
    companyId: user.companyId,
    status: STUDENT_STATUS.ACTIVE,
    enableBus: true
  };
  const whereTracking = {};

  const countryTz = user.timezone || DEFAULT_TIMEZONE;

  whereTracking.trackingDate = getStartDateUtcOfTimezoneDate(date, countryTz);

  const listAll = await db.Student.findAll({
    where,
    include: [
      { model: db.StudentBusStop, as: "toSchoolBusStop" },
      { model: db.StudentBusStop, as: "toHomeBusStop" },
      {
        required: false,
        model: db.StudentDailyTracking, as: "tracking", where: whereTracking,
        include: [
          { model: db.StudentBusStop, as: "checkInFromBus" },
          { model: db.StudentBusStop, as: "checkOutAtBus" }
        ]
      }
    ],
    order: [["alias", "asc"]]
  });

  const rs = [];
  for (let i = 0; i < listAll.length; i += 1) {
    const { tracking, toSchoolBusStop, toHomeBusStop } = listAll[i];
    let bus = tracking?.checkInFromBus || toSchoolBusStop;

    if (Number(direction) === BUS_DIRECTION.BACK) {
      bus = tracking?.checkOutAtBus || toHomeBusStop;
    }
    let exist = rs.find(t => t.bus.id === bus.id);
    if (!exist) {
      exist = { bus, signed: 0, unsigned: 0, total: 0, offline: 0 };
      rs.push(exist);
    }
    exist.total += 1;
    if (tracking?.status === STUDENT_DAILY_STATUS.ABSENT) {
      exist.offline += 1;
    }
    if (Number(direction) === BUS_DIRECTION.GO) {
      if (tracking?.checkInDate) {
        exist.signed += 1;
      } else {
        exist.unsigned += 1;
      }
    } else if (tracking?.checkOutDate) {
      exist.signed += 1;
    } else {
      exist.unsigned += 1;
    }
  }
  return rs;
}

export async function getListStudentTracking(user, {
  date, bus, search, direction = BUS_DIRECTION.GO,
  showUnsigned,
  showSigned
}) {
  console.log(direction, showSigned, showUnsigned);
  const where = {
    companyId: user.companyId,
    status: STUDENT_STATUS.ACTIVE
  };
  const whereTracking = {};

  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  let searchDate = new Date();
  if (hasText(date)) {
    searchDate = new Date(date);
  }
  console.log(date, searchDate, new Date(date));

  whereTracking.trackingDate = getStartDateUtcOfTimezoneDate(searchDate, countryTz);
  const isShowSigned = showSigned === "true";
  const isShowUnSigned = showUnsigned === "true";

  if (!(isShowSigned && isShowUnSigned)) {
    if (Number(direction) === BUS_DIRECTION.GO) {
      if (isShowSigned) {
        where[`$tracking.checkInDate$`] = {
          [Op.ne]: null
        };
      } else {
        where[`$tracking.checkInDate$`] = {
          [Op.eq]: null
        };
      }
    } else if (isShowSigned) {
      where[`$tracking.checkOutDate$`] = {
        [Op.ne]: null
      };
    } else {
      where[`$tracking.checkOutDate$`] = {
        [Op.eq]: null
      };
    }

  }

  if (hasText(bus)) {
    if (Number(direction) === BUS_DIRECTION.GO) {
      where[Op.or] = [
        {
          toSchoolBusStopId: bus
        }, {
          "$tracking.fromBusId$": bus
        }
      ];
    } else {
      where[Op.or] = [
        {
          toHomeBusStopId: bus
        },
        {
          "$tracking.toBusId$": bus
        }
      ];
    }
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
        "$father.firstName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$father.lastName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$mother.fullName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$mother.firstName$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$mother.lastName$": {
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
    order: [["enableBus", "desc"], ["alias", "asc"]]
  });
}

export async function sign(user, form, ip, deviceId, userAgent) {
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  console.log(form);
  const { date, type, signature, bus, studentId, location } = form;
  const dateObj = getStartDateUtcOfTimezoneDate(new Date(date), countryTz);
  let studentTracking = await db.StudentDailyTracking.findOne({
    where: {
      studentId, trackingDate: dateObj, companyId: user.companyId
    }
  });

  let coords = null;
  const typeNumber = Number(type);
  if (location) {
    const { latitude, longitude } = location;
    coords = { type: "Point", coordinates: [longitude, latitude] };
  }
  const fromBusId = typeNumber === BUS_DIRECTION.GO ? bus : 0;
  const toBusId = typeNumber === BUS_DIRECTION.BACK ? bus : 0;
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
    const checkInSignatureId = typeNumber === BUS_DIRECTION.GO ? newAsset.id : null;
    const checkOutSignatureId = typeNumber === BUS_DIRECTION.BACK ? newAsset.id : null;
    const checkInIP = typeNumber === BUS_DIRECTION.GO ? ip : "";
    const checkOutIP = typeNumber === BUS_DIRECTION.BACK ? ip : "";
    const checkInDeviceId = typeNumber === BUS_DIRECTION.GO ? deviceId : "";
    const checkOutDeviceId = typeNumber === BUS_DIRECTION.BACK ? deviceId : "";
    const checkInUserAgent = typeNumber === BUS_DIRECTION.GO ? userAgent : null;
    const checkOutUserAgent = typeNumber === BUS_DIRECTION.BACK ? userAgent : null;
    const checkInDate = typeNumber === BUS_DIRECTION.GO ? new Date() : null;
    const checkOutDate = typeNumber === BUS_DIRECTION.BACK ? new Date() : null;
    const checkInWithId = typeNumber === BUS_DIRECTION.GO ? user.id : null;
    const checkOutWithId = typeNumber === BUS_DIRECTION.BACK ? user.id : null;
    const checkInCoordinate = typeNumber === BUS_DIRECTION.GO ? coords : null;
    const checkOutCoordinate = typeNumber === BUS_DIRECTION.BACK ? coords : null;
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
        checkOutUserAgent,
        checkInCoordinate,
        checkOutCoordinate,
        lastModifiedDate: new Date()
      }, { transaction });
    } else if (typeNumber === BUS_DIRECTION.GO) {
      await studentTracking.update({
        fromBusId,
        checkInDate,
        checkInWithId,
        checkInSignatureId,
        checkInIP,
        checkInUserAgent,
        checkInDeviceId,
        checkInCoordinate,
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
        checkOutCoordinate,
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

export async function listStudentTracking(user, {
  studentId,
  fromDate,
  toDate,
  direction = BUS_DIRECTION.GO,
  showUnsigned = true,
  showSigned = true
}) {
  console.log(direction, showUnsigned, showSigned);
  const where = {
    companyId: user.companyId,
    studentId: studentId
  };
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  const dateRange = buildDateTimezoneRangeQuery(fromDate, toDate, countryTz);
  if (dateRange) {
    where.trackingDate = dateRange;
  }

  if (!(showUnsigned && showSigned)) {
    if (direction === BUS_DIRECTION.GO) {
      if (showUnsigned) {
        where.checkInDate = null;
      } else {
        where.checkInDate = {
          [Op.ne]: null
        };
      }
    } else if (showUnsigned) {
      where.checkOutDate = null;
    } else {
      where.checkOutDate = {
        [Op.ne]: null
      };
    }
  }

  return db.StudentDailyTracking.findAll({
    where,
    include: [
      { model: db.User, as: "checkInWith", attributes: DEFAULT_INCLUDE_USER_ATTRS },
      { model: db.User, as: "checkOutWith", attributes: DEFAULT_INCLUDE_USER_ATTRS },
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
    ],
    order: [["trackingDate", "asc"]]
  });
}

const updateOrCreateStudentTracking = async (companyId, student, date, remark, checkinPlace, checkoutPlace, status, transaction) => {
  const existed = await db.StudentDailyTracking.findOne({
    where: {
      trackingDate: date,
      studentId: student?.id,
      companyId
    },
    transaction
  });
  if (!existed) {
    return db.StudentDailyTracking.create({
      studentId: student.id,
      companyId,
      fromBusId: checkinPlace?.id,
      toBusId: checkoutPlace?.id,
      trackingDate: date,
      checkInRemark: remark,
      lastModifiedDate: new Date(),
      status
    }, { transaction });
  }
  existed.checkInRemark = remark;
  existed.status = status;
  existed.toBusId = checkoutPlace?.id;
  existed.fromBusId = checkinPlace?.id;
  existed.lastModifiedDate = new Date();
  return existed.save({ transaction });
};

export async function updateStudentTrackingStatus(user, form) {
  console.log(form)
  const { listDate, status, student, remark, checkinPlace, checkoutPlace } = form;
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  const transaction = await db.sequelize.transaction();
  try {
    for (let i = 0; i < listDate.length; i += 1) {
      const date = listDate[i];
      // eslint-disable-next-line no-await-in-loop
      await updateOrCreateStudentTracking(user.companyId, student, getStartDateUtcOfTimezoneDate(date, countryTz), remark, checkinPlace, checkoutPlace, status, transaction);
    }
    await transaction.commit();
    return true;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function studentTrackingStatusSummary(user, { fromDate, toDate }) {
  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  const dateRange = buildDateTimezoneRangeQuery(fromDate, toDate, countryTz);
  const where = {
    companyId: user.companyId,
    status: STUDENT_DAILY_STATUS.ABSENT
  };
  if (dateRange) {
    where.trackingDate = dateRange;
  }
  return db.StudentDailyTracking.findAll({
    attributes: ["studentId", [db.Sequelize.fn("count", db.Sequelize.col("studentDailyTracking.id")), "total"]],
    group: ["studentId"],
    include: [
      {
        model: db.Student, as: "student", include: [
          { model: db.Person, as: "child" }
        ]
      }
    ],
    where
  });
}


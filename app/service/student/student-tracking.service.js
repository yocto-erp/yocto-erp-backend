import db from "../../db/models";
import { DEFAULT_TIMEZONE, getStartDateUtcOfTimezoneDate } from "../../util/date.util";
import { isArrayHasLength } from "../../util/func.util";
import { hasText } from "../../util/string.util";

const { Op } = db.Sequelize;

export async function getListStudentTracking(user, { day, buses, search }) {
  const where = {
    companyId: user.companyId
  };
  const whereTracking = {};

  const countryTz = user.timezone || DEFAULT_TIMEZONE;
  let searchDate = new Date();
  if (hasText(day)) {
    searchDate = new Date(day);
  }
  whereTracking.trackingDate = getStartDateUtcOfTimezoneDate(searchDate, countryTz);

  if (isArrayHasLength(buses)) {
    whereTracking[db.Sequelize.Op.in] = buses.map(t => t.id);
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
    ]
  });
}

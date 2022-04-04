import PartnerCompany from "./partner-company";
import PartnerCompanyPerson from "./partner-company-person";
import PartnerPerson from "./partner-person";
import Subject from "./subject";

export const initPartnerModel = sequelize => ({
  Subject: Subject.init(sequelize),
  PartnerCompany: PartnerCompany.init(sequelize),
  PartnerCompanyPerson: PartnerCompanyPerson.init(sequelize),
  PartnerPerson: PartnerPerson.init(sequelize)
});

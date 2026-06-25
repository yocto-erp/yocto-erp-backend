import Company from './company';
import CompanySchoolUpdate from './company-school-update';
import CompanyPerson from './company-person';
import CompanyShop from './company-shop';
import CompanyConfigure from './company-configure';
import CompanySchool from './company-school';


export const initCompanyModel = sequelize => ({
  Company: Company.init(sequelize),
  CompanySchoolUpdate: CompanySchoolUpdate.init(sequelize),
  CompanyPerson: CompanyPerson.init(sequelize),
  CompanyShop: CompanyShop.init(sequelize),
  CompanyConfigure: CompanyConfigure.init(sequelize),
  CompanySchool: CompanySchool.init(sequelize)
});

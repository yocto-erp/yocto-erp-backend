import db from '../../db/models';
import { SUBJECT_CATEGORY, SUBJECT_TYPE } from '../../db/models/partner/subject';
import { newPerson } from '../person/person.util';
import { parseNameInfo } from '../../util/string.util';

export const createCustomerPerson = async ({
                                             name, email, phone, companyId, createdById
                                           }, transaction) => {
  const nameInfo = parseNameInfo(name)
  const person = await newPerson({
    firstName: nameInfo.firstName,
    lastName: nameInfo.lastName,
    gsm: phone,
    email,
    companyId,
    createdById
  }, transaction);
  return db.Subject.create({
    name,
    gsm: phone,
    email,
    companyId,
    type: SUBJECT_TYPE.PERSONAL,
    subjectCompanyId: 0,
    subjectCategoryId: SUBJECT_CATEGORY.CUSTOMER,
    personId: person.id,
    createdDate: new Date(),
    lastActionedDate: new Date(),
    createdById
  }, { transaction });
};

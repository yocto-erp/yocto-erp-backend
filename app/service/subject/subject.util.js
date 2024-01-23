import db from '../../db/models';
import { SUBJECT_CATEGORY, SUBJECT_TYPE } from '../../db/models/partner/subject';
import { newPerson } from '../person/person.util';

export const createCustomerPerson = async ({
                                             name, email, phone, companyId, createdById
                                           }, transaction) => {
  const person = await newPerson({
    firstName: '',
    lastName: name,
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

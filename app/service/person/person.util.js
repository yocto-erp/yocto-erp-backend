import db from '../../db/models';

export const newPerson = async ({
                                     firstName,
                                     lastName,
                                     gsm,
                                     email,
                                     address,
                                     birthday,
                                     sex,
                                     remark,
                                     createdById,
                                     companyId
                                   }, transaction = null) => {
  const person = await db.Person.create(
    {
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      gsm: gsm,
      email: email,
      address: address,
      birthday: birthday,
      sex,
      remark: remark,
      createdById,
      createdDate: new Date()
    }, { transaction }
  );

  await db.PartnerPerson.create({
    companyId: companyId,
    personId: person.id
  }, { transaction });

  return person;
};

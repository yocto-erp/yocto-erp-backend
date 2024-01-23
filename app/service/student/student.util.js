import db from '../../db/models';
import { paddingLeft } from '../../util/string.util';
import { MAIN_CONTACT_TYPE } from '../../db/models/student/student';

export const newStudent = async (subject, {
  status, fatherId = null, motherId = null, classes = [],
  mainContact = MAIN_CONTACT_TYPE.OWN, mainContactSubjectId, createdById
}, transaction = null) => {
  const student = await db.Student.create(
    {
      personId: subject.personId,
      companyId: subject.companyId,
      studentId: paddingLeft(`${subject.id}`, 10),
      status,
      fatherId,
      motherId,
      classId: classes?.[0],
      mainContact,
      subjectId: mainContactSubjectId,
      createdById,
      createdDate: new Date()
    }, { transaction }
  );
  if (classes && classes.length) {
    await db.StudentJoinClass.bulkCreate(classes.map(t => ({
      classId: t, studentId: student.id, createdDate: new Date()
    })), { transaction });
  }
  return student;
};

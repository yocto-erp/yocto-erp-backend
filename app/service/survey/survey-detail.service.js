import db from '../../db/models';

export function createSurveyI18N(surveyId, surveyI18Form, transaction) {
  return db.SurveyI18N.bulkCreate(surveyI18Form.map((t) => {
    return {
      surveyId: surveyId,
      languageId: t.languageId,
      name: t.name.trim(),
      remark: t.remark.trim()
    }
  }), {transaction})
}

export async function removeSurveyI18N(surveyId, transaction) {
  console.log('surveyId', surveyId);
  return db.SurveyI18N.destroy({
    where: { surveyId: surveyId}
  }, { transaction });
}

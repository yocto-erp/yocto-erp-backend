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
  return db.SurveyI18N.destroy({
    where: { surveyId: surveyId}
  }, { transaction });
}

export async function removeDetailSurvey(surveyId, transaction) {
  await removeSurveyI18N(surveyId, transaction);
  await db.SurveyI18N.destroy({
    where: { surveyId: surveyId}
  }, { transaction });
  return db.Survey.destroy({
    where: { id: surveyId}
  }, { transaction });
}

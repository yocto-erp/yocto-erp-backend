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

  // await db.SurveyQuestionAnswer.destroy({
  //   where: { questionId: qId}
  // }, { transaction });
  // await db.SurveyQuestion.destroy({
  //   where: { surveyId: surveyCheck.id }
  // }, { transaction });

  // return db.OrderDetail.destroy(
  //   {
  //     where: {
  //       orderId: orderId
  //     }
  //   }, {transaction}
  // );
}

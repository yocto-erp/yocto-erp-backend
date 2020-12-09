import db from '../../db/models';

async function createSurveyQuestion(surveyId, form, transaction) {
  const {content, type, introduction, data, priority, listAnswer, languages} = form;
  const question = await db.SurveyQuestion.create({
    content, type, introduction, data: JSON.stringify(data), priority, surveyId
  }, {transaction});

  if (languages && languages) {
    await db.SurveyQuestionI18N.bulkCreate(languages.map(t => ({
      surveyQuestionId: question.id,
      languageId: t.languageId,
      content: t.content
    })), {transaction})
  }

  const surveyAnswersI18N = [];
  const surveyAnswers = listAnswer.map((t, i) => {
    const {content: questionContent, key, languages: answerLanguages} = t;
    if (answerLanguages && answerLanguages.length) {
      answerLanguages.forEach(aL => {
        surveyAnswersI18N.push({
          surveyQuestionAnswerId: i + 1,
          surveyQuestionId: question.id,
          languageId: aL.languageId,
          content: aL.content
        });
      })
    }

    return {
      content: questionContent, key, id: i + 1, questionId: question.id
    }
  })
  await db.SurveyQuestionAnswer.bulkCreate(surveyAnswers, {transaction});
  if (surveyAnswersI18N.length) {
    await db.SurveyQuestionAnswerI18N.bulkCreate(surveyAnswersI18N, {transaction})
  }
  return question;
}

export async function createSurveyQuestions(surveyId, questions) {

  const transaction = await db.sequelize.transaction();
  try {
    for (let i = 0; i < questions.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await createSurveyQuestion(surveyId, questions[i], transaction);
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    console.error(e);
    throw e;
  }
}

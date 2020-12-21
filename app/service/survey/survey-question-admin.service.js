import db from '../../db/models';
import {badRequest, FIELD_ERROR} from "../../config/error";

export async function getSurveyQuestionsAdmin(id) {
  const survey = await db.Survey.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: db.SurveyQuestion, as: 'questions',
        include: [{model: db.SurveyQuestionAnswer, as: 'questionAnswers'}]
      }
    ],
    order: [
      [{model: db.SurveyQuestion, as: 'questions'}, 'id', 'asc'],
      [{model: db.SurveyQuestion, as: 'questions'}, {
        model: db.SurveyQuestionAnswer,
        as: 'questionAnswers'
      }, 'id', 'asc']
    ]
  })
  if (!survey) {
    throw badRequest('survey', FIELD_ERROR.INVALID, 'survey not found');
  }
  return survey;
}

export async function getQuestion(qId) {
  const question = await db.SurveyQuestion.findOne({
    where: {
      id: qId
    },
    include: [
      {
        model: db.SurveyQuestionAnswer,
        as: 'questionAnswers'
      }
    ]
  });
  if (!question) {
    throw badRequest('question', FIELD_ERROR.INVALID, 'question not found');
  }
  return question;
}

export async function createQuestion(createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const question = await db.SurveyQuestion.create({
      surveyId: createForm.surveyId,
      content: createForm.content.trim(),
      type: createForm.type
    }, {transaction});

    if (createForm?.questionAnswers && createForm?.questionAnswers.length) {
      await db.SurveyQuestionAnswer.bulkCreate(
        createForm?.questionAnswers.map((t, index) => {
          return {
            id: index + 1,
            questionId: question.id,
            content: t.content.trim(),
            key: t.key.trim()
          };
        }),
        {transaction}
      );
    }

    await transaction.commit();
    return question;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateQuestion(qId, updateForm) {

  const checkQuestion = await db.SurveyQuestion.findOne({
    where: {
      id: qId
    }
  });
  if (!checkQuestion) {
    throw badRequest('question', FIELD_ERROR.INVALID, 'question not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    checkQuestion.type = updateForm.type;
    checkQuestion.content = updateForm.content;
    await checkQuestion.save({transaction});
    await db.SurveyQuestionAnswer.destroy({
      where: {questionId: checkQuestion.id}
    }, {transaction});

    if (updateForm?.questionAnswers && updateForm?.questionAnswers.length) {
      await db.SurveyQuestionAnswer.bulkCreate(
        updateForm?.questionAnswers.map((t, index) => {
          return {
            id: index + 1,
            questionId: checkQuestion.id,
            content: t.content.trim(),
            key: t.key.trim()
          };
        }),
        {transaction}
      );
    }
    await transaction.commit();
    return checkQuestion;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

}

export async function removeQuestion(questionId) {
  const checkQuestion = await db.SurveyQuestion.findOne({
    where: {
      id: questionId
    }
  });
  if (!checkQuestion) {
    throw badRequest('question', FIELD_ERROR.INVALID, 'question not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    await db.SurveyQuestionAnswer.destroy({
      where: {questionId: checkQuestion.id}
    }, {transaction});
    const question = db.SurveyQuestion.destroy({
      where: {id: checkQuestion.id}
    }, {transaction});
    await transaction.commit();
    return question;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}


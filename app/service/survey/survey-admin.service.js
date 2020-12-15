import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import { createSurveyI18N, removeDetailSurvey, removeSurveyI18N } from './survey-detail.service';

const {Op} = db.Sequelize;

export function listSurveys(user, query, order, offset, limit) {
  const {search, type} = query;
  let where = {companyId: 0};
  if (search && search.length) {
    where = {
      ...where,
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`
          }
        }, {
          remark: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  if (type) {
    where.type = type;
  }
  return db.Survey.findAndCountAll({
    order,
    where,
    offset,
    limit
  });
}

export async function getSurvey(sId) {
  const survey = await db.Survey.findOne({
    where: {
      companyId: 0,
      id: sId
    },
    include: [{ model: db.SurveyI18N, as: 'surveyI18Ns', include: {model: db.Language, as: 'language'} }]
  });
  if (!survey) {
    throw badRequest('survey', FIELD_ERROR.INVALID, 'survey not found');
  }
  return survey;
}

export async function createSurvey(createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const survey = await db.Survey.create({
      name: createForm.name.trim(),
      remark: createForm.remark.trim(),
      companyId: 0,
      type: createForm.type,
      createdDate: new Date()
    }, {transaction});

    if (createForm && createForm?.surveyI18Ns && createForm?.surveyI18Ns.length) {
      await createSurveyI18N(survey.id, createForm.surveyI18Ns, transaction);
    }

    await transaction.commit();
    return survey;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateSurvey(sId, updateForm) {
  const surveyCheck = await db.Survey.findByPk(sId);
  if (!surveyCheck) {
    throw badRequest('survey', FIELD_ERROR.INVALID, 'survey not found');
  }
  const transaction = await db.sequelize.transaction();

  try {
    await surveyCheck.update({
      name: updateForm.name.trim(),
      remark: updateForm.remark.trim(),
      type: updateForm.type,
      lastModifiedDate: new Date(),
      lastModifiedById: 0
    }, transaction);
    if (updateForm.surveyI18Ns && updateForm.surveyI18Ns.length) {
      await removeSurvey(surveyCheck.id, transaction);
      await createSurveyI18N(surveyCheck.id, updateForm.surveyI18Ns, transaction);
    }
    await transaction.commit();
    return surveyCheck;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeSurvey(sId) {
  const surveyCheck = await db.Survey.findByPk(sId, {
    include: [
      {
        model: db.SurveyQuestion, as: 'questions'
      }
    ]
  });
  if (!surveyCheck) {
    throw badRequest('survey', FIELD_ERROR.INVALID, 'survey not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (surveyCheck && surveyCheck.questions.length) {
      const qId = surveyCheck.questions?.map(t => t.id);
      await db.SurveyQuestionAnswer.destroy({
        where: { questionId: qId}
      }, { transaction });
      await db.SurveyQuestion.destroy({
        where: { surveyId: surveyCheck.id }
      }, { transaction });
    }
    const survey = await removeDetailSurvey(surveyCheck.id, transaction)
    await transaction.commit();
    return survey;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

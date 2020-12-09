import express from 'express';
import {
  createQuestion,
  getQuestion,
  getSurveyQuestionsAdmin, removeQuestion, updateQuestion
} from '../../../service/survey/survey-question-admin.service';

const router = express.Router();

router.get('/:id(\\d+)/questions',
  (req, res, next) => {
    return getSurveyQuestionsAdmin(req.params.id)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  });

router.get('/:id(\\d+)',(req, res, next) => {
  return getQuestion(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


router.post('/',  (req, res, next) => {
  return createQuestion(req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

router.post('/:id(\\d+)', (req, res, next) => {
  return updateQuestion(req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', (req, res, next) => {
  return removeQuestion(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initSurveyQuestionAdminController(app) {
  app.use('/api/survey-question-admin', router);
}

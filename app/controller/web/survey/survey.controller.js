import express from 'express';
import {
  exportSurveyAnswerRaw,
  getAllQuestions,
  getQuestionSummary,
  getResultQuestion,
  getSurvey,
  getSurveySummary,
  listSurveyPersonAnswer,
  listSurveyResults,
  postAnswerQuestion,
  sendSurveyCode,
  surveyJoin
} from '../../../service/survey/survey.service';
import {getIP, getOrigin, userAgent} from "../../../util/request.util";
import {pagingParse} from "../../middleware/paging.middleware";
import {badRequest} from "../../../config/error";

const router = express.Router();

router.get('/:id(\\d+)',
  (req, res, next) => {
    return getSurvey(req.params.id, req.query.language)
      .then(result => {
        if (!result) {
          throw badRequest('survey', 'NOT_FOUND', 'not found any survey');
        }
        const {id, name, type, remark, totalAnswer} = result;
        res.status(200).json({id, name, type, remark, totalAnswer});
      })
      .catch(next);
  });

router.post('/:id(\\d+)/question/:questionId(\\d+)/summary',
  (req, res, next) => {
    return getQuestionSummary(req.params.questionId, req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  });

router.get('/:id(\\d+)/results', pagingParse({column: 'id', dir: 'desc'}),
  (req, res, next) => {
    return listSurveyResults(req.params.id, req.paging, req.query)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  });

router.post('/:id(\\d+)/code',
  (req, res, next) => {
    const origin = getOrigin(req);
    return sendSurveyCode(req.params.id, req.body, origin)
      .then(() => res.status(200).json(req.body))
      .catch(next);
  });

router.get('/:code/join',
  async (req, res, next) => {
    return surveyJoin(req.params.code, req.query.language)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:code/answer',
  async (req, res, next) => {
    try {
      const decodeCode = Buffer.from(req.params.code, 'base64').toString('ascii');
      const [surveyId, clientId, target, code] = decodeCode.split('|');

      const ip = getIP(req);
      const clientAgent = userAgent(req);
      return postAnswerQuestion(surveyId, clientId, target, code, req.body, ip, clientAgent)
        .then(result => res.status(200).json(result))
        .catch(next);
    } catch (e) {
      return next(e);
    }
  });

router.get('/result/:surveyId/:target',
  async (req, res, next) => {
    return getResultQuestion(req.params)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.get('/:id(\\d+)/person-answers', pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return listSurveyPersonAnswer(req.params.id, req.paging.order, req.paging.offset, req.paging.size, req.query)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  });

router.get('/:id(\\d+)/person-answers/raw',
  (req, res, next) => {
    try {
      res.set('Content-Type', 'text/csv');

      return exportSurveyAnswerRaw(req.params.id, res);
    } catch (e) {
      return next(e);
    }
  });

router.get('/:id(\\d+)/questions',
  (req, res, next) => {
    return getAllQuestions(req.params.id)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  });

router.get('/:surveyId/summary',
  async (req, res, next) => {
    return getSurveySummary(req.params.surveyId)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

export function initSurveyController(app) {
  app.use('/api/survey', router);
}

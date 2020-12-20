import db from '../../db/models';
import {badRequest, FIELD_ERROR} from "../../config/error";
import {SURVEY_TYPE} from "../../db/models/survey/survey";
import {generateCode, isValidCode, sendSurveyEmailOtp} from "../otp.service";
import {OTP_TARGET_TYPE} from "../../db/models/otp";
import {isArray} from "../../util/func.util";
import {SURVEY_QUESTION_TYPE} from "../../db/models/survey/survey-question";
import {addIPFS} from "../ipfs.service";
import {sign} from "../ethereum/vote-manager.service";
import {getGenderStr} from "../../db/models/person";
import {formatDateTime} from "../template/template.util";

const Stream = require('stream');

const {Op} = db.Sequelize;

export async function createSurvey({name, remark, type, languages}, user = {}) {
  const {companyId = 0, id = 0} = user;
  const transaction = await db.sequelize.transaction();
  try {
    const survey = await db.Survey.create({
      companyId,
      name,
      remark,
      type,
      createdById: id,
      createdDate: new Date(),
      totalAnswer: 0
    }, {transaction});
    if (languages && languages.length) {
      await db.SurveyI18N.bulkCreate(languages.map(t => ({
        surveyId: survey.id,
        languageId: t.languageId,
        name: t.name,
        remark: t.remark
      })), {transaction});
    }
    await transaction.commit();
    return survey;
  } catch (e) {
    await transaction.rollback();
    throw e
  }
}

export async function getQuestionSummary(questionId, search) {
  const {fromDate, toDate, questions} = search;

  let isNeedFilter = false;
  let filterSurvey = [];
  const surveyPersonAnswerWhere = {
    questionId
  };
  if (fromDate || toDate || (questions && questions.length)) {
    isNeedFilter = true;
    const personSearch = {};
    const personAnswerSearch = {};
    const havingWhere = {};
    if (fromDate && toDate) {
      personSearch.submittedDate = {
        [Op.and]: {
          [Op.gte]: new Date(fromDate),
          [Op.lte]: new Date(toDate)
        }
      };
    } else if (fromDate) {
      personSearch.submittedDate = {
        [Op.gte]: new Date(fromDate)
      };
    } else if (toDate) {
      personSearch.submittedDate = {
        [Op.lte]: new Date(toDate)
      };
    }

    if (questions && questions.length) {
      const filterQuestion = questions.filter(t => t.key && t.key.length);
      personAnswerSearch[Op.or] = filterQuestion.filter(t => t.key && t.key.length).map(t => {
        const {questionId: searchQuestionId, key} = t;
        return {
          questionId: searchQuestionId, answer: key
        }
      })
      havingWhere.total = filterQuestion.length;
    }

    console.log(personAnswerSearch);
    const personFilter = await db.SurveyPersonAnswer.findAll({
      attributes: ['surveyPersonId', [db.Sequelize.fn('count', db.Sequelize.col('SurveyPersonAnswer.id')), 'total']],
      where: personAnswerSearch,
      include: [
        {model: db.SurveyPerson, required: true, where: personSearch, attributes: []}
      ],
      group: ['surveyPersonId'],
      having: havingWhere
    });

    filterSurvey = personFilter.map(t => t.surveyPersonId);
    surveyPersonAnswerWhere.surveyPersonId = {
      [Op.in]: filterSurvey
    }
  }

  console.log(`SurveyPersonAnswerWhere`, surveyPersonAnswerWhere);

  const question = await db.SurveyQuestion.findByPk(questionId, {
    include: [
      {model: db.SurveyQuestionAnswer, as: 'questionAnswers'}
    ],
    order: [
      ['id', 'asc'],
      [{
        model: db.SurveyQuestionAnswer,
        as: 'questionAnswers'
      }, 'id', 'asc']
    ]
  })
  const answers = await db.SurveyPersonAnswer.findAll({
    attributes: ['answer', [db.Sequelize.fn('count', db.Sequelize.col('id')), 'total']],
    group: ['answer'],
    where: surveyPersonAnswerWhere,
    raw: true
  });

  const {content, type, questionAnswers} = question;
  const answerContents = [];
  const answerTotals = [];

  for (let i = 0; i < questionAnswers.length; i += 1) {
    const {content: answerContent, key} = questionAnswers[i];
    let total = 0;
    for (let j = 0; j < answers.length; j += 1) {
      if (key === answers[j].answer) {
        console.log(answers[j]);
        // eslint-disable-next-line prefer-destructuring
        total = answers[j].total;
        break;
      }
    }
    answerContents.push(answerContent);
    answerTotals.push(total);
  }

  return {content, type, answers: answerContents, totals: answerTotals};
}

async function getSurveyWithLanguageId(surveyId, languageId) {
  return db.SurveyI18N.findOne({
    where: {
      surveyId,
      languageId
    },
    include: [
      {model: db.Survey, as: 'survey'}
    ]
  }).then(t => {
    if (!t) {
      throw badRequest('survey', 'INVALID', 'Not found any survey with language');
    }
    return {
      id: t.survey.id,
      type: t.survey.type,
      name: t.name,
      remark: t.remark,
      languageId
    };
  });
}

export async function getSurvey(id, language) {
  let rs;
  if (language) {
    const lang = await db.Language.findOne({
      where: {code: language}
    });
    if (lang) {
      try {
        rs = await getSurveyWithLanguageId(id, lang.id);
        // eslint-disable-next-line no-empty
      } catch (any) {
      }
    }
  }
  if (!rs) {
    rs = await db.Survey.findByPk(Number(id));
  }
  return rs;
}

export function listSurveyResults(id, paging, query) {
  const {search} = query;
  let wherePerson = {};
  if (search && search.length) {
    wherePerson = {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${search}%`
          }
        }, {
          lastName: {
            [Op.like]: `%${search}%`
          }
        }, {
          email: {
            [Op.like]: `%${search}%`
          }
        }, {
          gsm: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }

  return db.SurveyPerson.findAndCountAll({
    where: {
      surveyId: id
    },
    include: [
      {
        model: db.Person,
        where: wherePerson
      }
    ],
    ...paging
  });
}

export async function sendSurveyCode(id, form, origin) {
  const {target, clientId} = form;
  const survey = await getSurvey(id);
  let otpType = OTP_TARGET_TYPE.EMAIL;
  if (!survey) {
    throw badRequest('survey', 'INVALID', 'Invalid survey id');
  }
  const surveyPersonWhere = {};
  const personWhere = {};
  if (survey.type === SURVEY_TYPE.EMAIL_VERIFY) {
    personWhere.email = target;
  } else if (survey.type === SURVEY_TYPE.SMS_VERIFY) {
    otpType = OTP_TARGET_TYPE.SMS;
    personWhere.gsm = target;
  } else {
    surveyPersonWhere.clientId = clientId;
    surveyPersonWhere.surveyId = id;
  }

  const surveyPerson = await db.SurveyPerson.findOne({
    where: surveyPersonWhere,
    include: [
      {
        model: db.Person, required: true, where: personWhere
      }
    ]
  });
  if (surveyPerson) {
    throw badRequest('survey', 'EXISTED', 'You has join the survey');
  }

  const code = await generateCode(clientId, target, otpType);
  if (survey.type === SURVEY_TYPE.EMAIL_VERIFY) {
    const base64Code = Buffer.from(`${id}|${clientId}|${target}|${code}`).toString('base64');
    const url = `${origin}/survey/${base64Code}`;
    sendSurveyEmailOtp(target, code, survey.name, url).then();
    // eslint-disable-next-line no-empty
  } else if (survey.type === SURVEY_TYPE.SMS_VERIFY) {
  }
  return code;
}

export async function getSurveyQuestions(surveyId, language = '') {
  const survey = await getSurvey(surveyId, language);
  if (!survey) {
    throw badRequest('survey', FIELD_ERROR.INVALID, 'survey not found');
  }

  let questions = [];
  let languageId = 0;
  console.log('language', language);
  if (language) {
    const lang = await db.Language.findOne({
      where: {code: language}
    });
    if (lang) {
      languageId = lang.id;
    }
  }
  if (languageId) {
    questions = await db.SurveyQuestionI18N.findAll({
      where: {
        languageId: languageId
      },
      include: [
        {
          model: db.SurveyQuestion, as: 'surveyQuestion', required: true, where: {
            surveyId: survey.id
          }
        }
      ],
      order: [
        [{model: db.SurveyQuestion, as: 'surveyQuestion'}, 'id', 'asc']
      ]
    }).then(t => {
      return t.map(item => {
        const {surveyQuestion: {type, introduction, data, id, content}, content: contentI18N} = item;
        return {
          content: contentI18N || content, type, introduction, data, id
        };
      })
    });
  }
  if (!questions.length) {
    questions = await db.SurveyQuestion.findAll({
      where: {
        surveyId: survey.id
      },
      order: [
        ['id', 'asc']
      ]
    }).then(t => {
      return t.map(item => {
        const {type, introduction, data, content, id} = item;
        return {
          type, introduction, data, content, id
        }
      })
    })
  }
  console.log('question', questions);
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    let answers = [];
    if (languageId) {
      // eslint-disable-next-line no-await-in-loop
      answers = await db.SurveyQuestionAnswerI18N.findAll({
        where: {
          surveyQuestionId: question.id,
          languageId
        },
        include: [
          {
            model: db.SurveyQuestionAnswer, as: 'surveyQuestionAnswer', where: {
              questionId: question.id
            }
          }
        ]
      }).then(t => {
        return t.map(item => {
          const {content: contentI18N, surveyQuestionAnswer: [{id, key, content}]} = item;
          return {content: contentI18N || content, id, key};
        })
      })
    }
    if (!answers.length) {
      // eslint-disable-next-line no-await-in-loop
      answers = await db.SurveyQuestionAnswer.findAll({
        where: {
          questionId: question.id
        }
      }).then(t => {
        return t.map(item => {
          const {content, id, key} = item;
          return {content, id, key}
        })
      })
    }
    question.questionAnswers = answers;
  }

  return {
    id: survey.id,
    type: survey.type,
    name: survey.name,
    remark: survey.remark,
    languageId, questions
  };
}

export async function surveyJoin(requestCode, language) {
  const decodeCode = Buffer.from(requestCode, 'base64').toString('ascii');
  const [surveyId, clientId, target, code] = decodeCode.split('|');
  const survey = await getSurveyQuestions(surveyId, language);
  if (!survey) {
    throw badRequest('survey', 'INVALID', 'Invalid survey id');
  }

  console.log('survey', survey);
  const surveyPersonWhere = {};
  const personWhere = {};
  if (survey.type === SURVEY_TYPE.EMAIL_VERIFY) {
    personWhere.email = target;
  } else if (survey.type === SURVEY_TYPE.SMS_VERIFY) {
    personWhere.gsm = target;
  } else {
    surveyPersonWhere.clientId = clientId;
    surveyPersonWhere.surveyId = surveyId;
  }

  const checkSurveyPerson = await db.SurveyPerson.findOne({
    where: surveyPersonWhere,
    include: [
      {
        model: db.Person, required: true, where: personWhere
      }
    ]
  });
  if (checkSurveyPerson) {
    throw badRequest('survey', 'EXISTED', 'You has join the survey');
  }

  if (survey.type !== SURVEY_TYPE.PUBLIC) {
    await isValidCode(clientId, target, code);
  }

  return survey;
}

export async function postAnswerQuestion(surveyId, clientId, target, code, form, ip, clientAgent) {
  const survey = await getSurvey(surveyId, form.language);
  if (!survey) {
    throw badRequest('survey', 'INVALID', 'Invalid survey id');
  }

  if (survey.type !== SURVEY_TYPE.PUBLIC) {
    await isValidCode(clientId, target, code);
  }

  const lang = await db.Language.findOne({
    where: {
      code: form.language
    }
  });

  const surveyPersonWhere = {};
  const personWhere = {};
  if (survey.type === SURVEY_TYPE.EMAIL_VERIFY) {
    personWhere.email = target;
  } else if (survey.type === SURVEY_TYPE.SMS_VERIFY) {
    personWhere.gsm = target;
  } else {
    surveyPersonWhere.surveyId = survey.id;
    surveyPersonWhere.clientId = clientId;
  }

  const checkSurveyPerson = await db.SurveyPerson.findOne({
    where: surveyPersonWhere,
    include: [
      {
        model: db.Person, required: true, where: personWhere
      }
    ]
  });
  if (checkSurveyPerson) {
    throw badRequest('survey', 'EXISTED', 'You has join the survey');
  }

  const transaction = await db.sequelize.transaction();
  try {
    const {firstName, lastName, address, email, age, gender} = form.formPerson;
    const createPerson = await db.Person.create(
      {
        firstName,
        lastName,
        email: target || email,
        sex: gender,
        address,
        createdById: 0,
        createdDate: new Date()
      }, {transaction}
    );

    const createSurveyPerson = await db.SurveyPerson.create({
      surveyId: surveyId,
      companyId: 0,
      personId: createPerson.id,
      clientId: clientId,
      submittedDate: new Date(),
      IP: ip,
      ageRange: age,
      languageId: lang?.id,
      clientAgent
    }, transaction);
    const personAnswers = [];
    const {formAnswer} = form;

    for (let i = 0; i < formAnswer.length; i += 1) {
      const item = formAnswer[i];
      const {questionId, answer} = item;
      if (isArray(answer)) {
        answer.forEach(t => {
          personAnswers.push({
            surveyPersonId: createSurveyPerson.id,
            questionId,
            answer: t
          })
        })
      } else {
        personAnswers.push({
          surveyPersonId: createSurveyPerson.id,
          questionId,
          answer: answer
        })
      }
    }
    const createSurveyQuestion = await db.SurveyPersonAnswer.bulkCreate(
      personAnswers,
      {transaction}
    );
    await transaction.commit();
    return createSurveyQuestion;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getQuestionWithLangId(questionId, languageId) {
  let question;
  if (languageId) {
    question = await db.SurveyQuestionI18N.findOne({
      where: {
        languageId,
        surveyQuestionId: questionId
      },
      include: [
        {model: db.SurveyQuestion, as: 'surveyQuestion'},
        {
          model: db.SurveyQuestionAnswerI18N, as: 'questionAnswersI18N', where: {
            languageId
          },
          include: [
            {
              model: db.SurveyQuestionAnswer, as: 'surveyQuestionAnswer', where: {
                questionId
              }
            }
          ]
        }
      ],
      order: [['surveyQuestionId', 'asc']]
    }).then(questionI18N => {
        if (!questionI18N) return null;
        const {
          content, surveyQuestion: {
            id,
            surveyId,
            type,
            rightAnswer,
            introduction,
            priority,
            data
          },
          questionAnswersI18N
        } = questionI18N;
        return {
          content, id,
          surveyId,
          type,
          rightAnswer,
          introduction,
          priority,
          data,
          answers: questionAnswersI18N.map(aItem => {
            const {content: answerContent, surveyQuestionAnswer: [{id: answerId, key}]} = aItem;
            return {content: answerContent, id: answerId, key};
          })
        };
      }
    )
  }
  if (!question) {
    question = await db.SurveyQuestion.findByPk(questionId, {
      include: [
        {
          model: db.SurveyQuestionAnswer, as: 'questionAnswers'
        }
      ],
      order: [
        ['id', 'asc']
      ]
    }).then(questionItem => {
      const {
        content,
        id,
        surveyId,
        type,
        rightAnswer,
        introduction,
        priority,
        data,
        questionAnswers
      } = questionItem;
      return {
        content, id,
        surveyId,
        type,
        rightAnswer,
        introduction,
        priority,
        data,
        answers: questionAnswers.map(aItem => {
          const {content: answerContent, id: answerId, key} = aItem;
          return {content: answerContent, id: answerId, key};
        })
      };
    });
  }
  return question;
}

async function mapSurveyPersonData(surveyPerson) {
  const {
    IP,
    clientAgent,
    clientId,
    person,
    submittedDate,
    surveyPersonAnswers,
    ipfsId, blockchainId,
    languageId,
    surveyId
  } = surveyPerson;

  console.log(surveyPerson);
  let survey;
  try {
    survey = await getSurveyWithLanguageId(surveyId, languageId);
  } catch (e) {
    survey = await db.Survey.findByPk(surveyId);
  }


  const answers = [];
  for (let i = 0; i < surveyPersonAnswers.length; i += 1) {
    const {questionId, answer} = surveyPersonAnswers[i];
    // eslint-disable-next-line no-await-in-loop
    const question = await getQuestionWithLangId(questionId, languageId);
    console.log(question, surveyPersonAnswers[i]);
    let existedQuestion = null;
    let userAnswers;

    for (let j = 0; j < answers.length; j += 1) {
      if (answers[j].question.id === questionId) {
        existedQuestion = answers[j];
        break;
      }
    }
    const userAnswerObj = question.answers.find(t => t.key === answer);
    if (existedQuestion) {
      if (question.type === SURVEY_QUESTION_TYPE.CHECKBOX) {
        userAnswers = [...existedQuestion.answer, userAnswerObj.key];
      } else {
        userAnswers = userAnswerObj.key;
      }
      existedQuestion.answer = userAnswers;
    } else {
      if (question.type === SURVEY_QUESTION_TYPE.CHECKBOX) {
        userAnswers = [userAnswerObj.key];
      } else {
        userAnswers = userAnswerObj.key;
      }
      existedQuestion = {question, answer: userAnswers};
      answers.push(existedQuestion);
    }
  }


  return {
    IP,
    clientAgent,
    clientId,
    person,
    submittedDate,
    survey,
    answers: answers,
    ipfsId, blockchainId
  };
}

export async function getResultQuestion({surveyId, target}) {
  const survey = await getSurvey(surveyId);
  if (!survey) {
    throw badRequest('survey', 'INVALID', 'Invalid survey id');
  }
  const surveyPersonWhere = {surveyId};
  const personWhere = {};
  if (survey.type === SURVEY_TYPE.EMAIL_VERIFY) {
    personWhere.email = target;
  } else if (survey.type === SURVEY_TYPE.SMS_VERIFY) {
    personWhere.gsm = target;
  } else {
    surveyPersonWhere.clientId = target;
  }

  const surveyPerson = await db.SurveyPerson.findOne({
    where: surveyPersonWhere,
    include: [
      {
        model: db.Person, required: true, where: personWhere
      },
      {
        model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'
      }
    ],
    order: [
      [{model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'}, 'id', 'asc']
    ]
  });
  if (!surveyPerson) {
    throw badRequest('email', 'INVALID', `Invalid ${target}`);
  }

  return mapSurveyPersonData(surveyPerson);
}

function mapSurveyForIPFS(survey) {
  const {
    IP,
    clientAgent,
    clientId,
    person,
    submittedDate,
    survey: item,
    answers
  } = survey;
  return {
    IP,
    clientAgent,
    clientId,
    person,
    submittedDate,
    survey: item,
    answers
  }
}

async function syncSurveyPerson(surveyPerson) {
  const surveyPersonId = surveyPerson.id;
  const survey = await mapSurveyPersonData(surveyPerson);
  // eslint-disable-next-line prefer-const
  let {ipfsId, blockchainId} = surveyPerson;
  if (!ipfsId) {
    ipfsId = await addIPFS(mapSurveyForIPFS(survey));
    db.SurveyPerson.update({
      ipfsId,
      lastUpdatedDate: new Date()
    }, {
      where: {
        id: surveyPersonId
      }
    }).then((resp) => {
      console.log('Update success', resp);
    }, (err) => {
      console.log('Update err', err);
    });
  }

  if (!blockchainId) {
    sign(ipfsId, surveyPersonId, async (txId) => {
      surveyPerson.blockchainId = txId;
      surveyPerson.lastUpdatedDate = new Date();
      await surveyPerson.save();
    }).then((resp) => {
      console.log('Success', resp);
    }, (err) => {
      console.log('Error', err);
    })
  }
}

export async function getAllSurveyNotYetSync() {
  const surveyPersons = await db.SurveyPerson.findAll({
    where: {
      [Op.or]: [
        {
          ipfsId: {
            [Op.eq]: null
          }
        }, {
          blockchainId: {
            [Op.eq]: null
          }
        }
      ]
    },
    include: [
      {
        model: db.Person
      },
      {
        model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers',
        include: [
          {model: db.SurveyQuestion, as: 'question'}
        ]
      },
      {
        model: db.Survey
      }
    ],
    order: [
      [{model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'}, 'id', 'asc']
    ]
  });
  try {
    for (let i = 0; i < surveyPersons.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await syncSurveyPerson(surveyPersons[i]);
    }
  } catch (e) {
    console.error('Got error', e);
  }
}

export function listSurveyPersonAnswer(id, order, offset, limit, query) {
  const {search, age, address, gender} = query;
  let wherePerson = {};
  const whereSurveyPerson = {surveyId: id};
  if (search && search.length) {
    wherePerson = {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${search}%`
          }
        }, {
          lastName: {
            [Op.like]: `%${search}%`
          }
        }, {
          email: {
            [Op.like]: `%${search}%`
          }
        }, {
          gsm: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    };
  }
  if (age && age.length) {
    whereSurveyPerson.ageRange = age;
  }
  if (address && address.length) {
    wherePerson = {
      ...wherePerson,
      address
    }
  }
  if (gender) {
    wherePerson.sex = gender;
  }
  return db.SurveyPerson.findAndCountAll({
    distinct: true,
    where: whereSurveyPerson,
    include: [
      {
        model: db.Person,
        where: wherePerson,
        required: true
      },
      {
        model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'
      }
    ],
    order: [
      [...order],
      [{model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'}, 'questionId', 'asc']
    ],
    offset,
    limit
  });
}

export async function getAllQuestions(surveyId) {
  return db.SurveyQuestion.findAll({
    where: {
      surveyId: surveyId
    },
    include: [
      {model: db.SurveyQuestionAnswer, as: 'questionAnswers'}
    ],
    order: [
      [{model: db.SurveyQuestionAnswer, as: 'questionAnswers'}, 'questionId', 'asc'],
      [{model: db.SurveyQuestionAnswer, as: 'questionAnswers'}, 'id', 'asc']
    ]
  });
}

export async function exportSurveyAnswerRaw(id, res) {
  const readableStream = new Stream.Readable({
    read() {
    }
  });

  const whereSurveyPerson = {surveyId: id};
  const questions = await getAllQuestions(id);

  const survey = await getSurvey(id);
  res.setHeader('Content-disposition', `attachment; filename=${survey.name}.csv`);
  const surveyPerson = await db.SurveyPerson.findAll({
    distinct: true,
    where: whereSurveyPerson,
    include: [
      {
        model: db.Person,
        required: true
      },
      {
        model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'
      }
    ],
    order: [
      [{model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'}, 'questionId', 'asc'],
      [{model: db.SurveyPersonAnswer, as: 'surveyPersonAnswers'}, 'id', 'asc']
    ]
  });
  const newLine = '\r\n';
  readableStream.pipe(res);
  const headers = ['ClientId'];
  for (let i = 0; i < questions.length; i += 1) {
    const {questionAnswers, type} = questions[i];
    const questionIndex = i + 1;
    if (type === SURVEY_QUESTION_TYPE.CHECKBOX) {
      for (let j = 0; j < questionAnswers.length; j += 1) {
        headers.push(`Q${questionIndex}_${j + 1}`);
      }
    } else {
      headers.push(`Q${questionIndex}`);
    }
  }
  headers.push('First Name', 'Last Name', 'Gender', 'Age Range', 'Email', 'City', 'Submitted Date')
  console.log(headers);
  readableStream.push(`${headers.join(',')}${newLine}`);

  for (let spI = 0; spI < surveyPerson.length; spI += 1) {
    const {
      person: {firstName, lastName, email, sex, address},
      surveyPersonAnswers,
      submittedDate,
      clientId,
      ageRange
    } = surveyPerson[spI];
    const row = [clientId];
    for (let i = 0; i < questions.length; i += 1) {
      const {questionAnswers, type, id: questionId} = questions[i];
      const userAnswerQuestions = surveyPersonAnswers.filter(t => t.questionId === questionId);
      // console.log('Question', questions[i].get({plain: true}));
      // console.log('UserAnswers', userAnswerQuestions.map(t => t.get({plain: true})));
      if (type === SURVEY_QUESTION_TYPE.CHECKBOX) {
        for (let j = 0; j < questionAnswers.length; j += 1) {
          const {key} = questionAnswers[j];
          const isUserHasAnswer = userAnswerQuestions.find(t => t.answer === key);
          console.log('Question', questionId, 'answer', key, 'userAnswer', isUserHasAnswer);
          if (isUserHasAnswer) {
            row.push('1');
          } else {
            row.push('');
          }
        }
      } else {
        const userAnswer = userAnswerQuestions[0];
        const indexAnswer = questionAnswers.findIndex(t => t.key === userAnswer.answer);
        row.push(indexAnswer + 1);
      }
    }
    row.push(firstName, lastName, getGenderStr(sex), ageRange, email, address, formatDateTime(submittedDate))
    readableStream.push(`${row.join(',')}${newLine}`);
  }
  readableStream.push(null);
}

export async function getSurveySummary(surveyId) {
  const total = await db.SurveyPerson.count({
    where: {
      surveyId
    }
  });

  const age = await db.SurveyPerson.findAll({
    attributes: ['ageRange', [db.Sequelize.fn('count', db.Sequelize.col('id')), 'total']],
    group: ['ageRange'],
    where: {
      surveyId
    },
    raw: true
  });

  const location = await db.sequelize.query(`select count(sp.id) as total, address
  from survey_person sp INNER JOIN person p on sp.personId = p.id where sp.surveyId = ${surveyId} group by address order by address ASC`, {type: db.Sequelize.QueryTypes.SELECT});

  const gender = await db.sequelize.query(`select count(sp.id) as total, p.sex
  from survey_person sp INNER JOIN person p on sp.personId = p.id where sp.surveyId = ${surveyId} group by p.sex`, {type: db.Sequelize.QueryTypes.SELECT});
  return {
    total, age, location, gender
  }
}

import {SURVEY} from "../../data/survey-japan";
import {createSurvey, getAllSurveyNotYetSync} from "../../../app/service/survey/survey.service";
import {createSurveyQuestions} from "../../../app/service/survey/survey-question.service";

describe('survey', () => {
  it('Create Survey', async function createSurveyTest() {
    const survey = await createSurvey({
      remark: SURVEY.remark, name: SURVEY.name, type: SURVEY.type, languages: SURVEY.languages
    });
    await createSurveyQuestions(survey.id, SURVEY.questions);
    console.log(survey);
  });

  it('getAllSurveyNotYetSync', async function getAllSurveyNotYetSyncTest() {
    console.log(JSON.stringify(await getAllSurveyNotYetSync()));
  })

  it('getIPFSData', async function getAllSurveyNotYetSyncTest() {
    const surveyPerson = await db.SurveyPerson.findByPk(11);

    console.log(JSON.stringify(await getAllSurveyNotYetSync()));
  })
});

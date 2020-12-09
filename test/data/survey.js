import {SURVEY_QUESTION_TYPE} from "../../app/db/models/survey/survey-question";
import {SURVEY_TYPE} from "../../app/db/models/survey/survey";

export const SURVEY = {
  name: 'American Conservative CPAC',
  type: SURVEY_TYPE.EMAIL_VERIFY,
  remark: 'Testing Survey',
  questions: [
    {
      type: SURVEY_QUESTION_TYPE.CHECKBOX,
      content: 'From the following list of issue areas, please indicate the TOP THREE that are most important to you',
      data: {max: 3},
      listAnswer: [
        {
          content: 'Healthcare Reform',
          key: 'Healthcare Reform'
        }, {
          content: 'Re-opening schools',
          key: 'Re-opening schools'
        }, {
          content: 'Second Amendment Rights',
          key: 'Second Amendment Rights'
        }, {
          content: 'Immigration and building the border wall',
          key: 'Immigration and building the border wall'
        }, {
          content: 'Criminal Justice Reform',
          key: 'Criminal Justice Reform'
        }, {
          content: 'Supporting law enforcement',
          key: 'Supporting law enforcement'
        }, {
          content: 'Energy and Environment issues',
          key: 'Energy and Environment issues'
        }, {
          content: 'Human Dignity and Pro-Life issues',
          key: 'Human Dignity and Pro-Life issues'
        }, {
          content: 'Privacy and Government Data Collection',
          key: 'Privacy and Government Data Collection'
        }, {
          content: 'The Supreme Court and other judicial positions',
          key: 'The Supreme Court and other judicial positions'
        }, {
          content: 'Taxes, Budget and Spending',
          key: 'Taxes, Budget and Spending'
        }, {
          content: 'Education and School Choice',
          key: 'Education and School Choice'
        }, {
          content: 'Re-opening the economy',
          key: 'Re-opening the economy'
        }, {
          content: 'National Security and Foreign Policy',
          key: 'National Security and Foreign Policy'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'How confident are you that President Trump will win re-election and defeat Joe Biden ?',
      listAnswer: [
        {
          content: 'Very confident',
          key: 'Very confident'
        }, {
          content: 'Somewhat confident',
          key: 'Somewhat confident'
        }, {
          content: 'Not that confident',
          key: 'Not that confident'
        }, {
          content: 'Not at all confident',
          key: 'Not at all confident'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Do you approve or disapprove of the job that Donald Trump is doing as President ?',
      listAnswer: [
        {
          content: 'Strongly approve',
          key: 'Strongly approve'
        }, {
          content: 'Somewhat approve',
          key: 'Somewhat approve'
        }, {
          content: 'Somewhat disapprove',
          key: 'Somewhat disapprove'
        }, {
          content: 'Strongly disapprove',
          key: 'Strongly disapprove'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Which of the following comes closest to your own personal opinion ?',
      listAnswer: [
        {
          content: 'Republicans in Congress should be doing more to SUPPORT President Trump',
          key: 'SUPPORT'
        }, {
          content: 'Republicans in Congress should be doing more to OPPOSE President Trump',
          key: 'OPPOSE'
        }, {
          content: 'Republicans in Congress are doing ENOUGH TO SUPPORT President Trump',
          key: 'ENOUGH'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Do you support or oppose President Trump\'s Supreme Court nominee Amy Coney Barrett having a confirmation vote before the presidential election ?',
      listAnswer: [
        {
          content: 'Strongly support',
          key: 'Strongly support'
        }, {
          content: 'Somewhat support',
          key: 'Somewhat support'
        }, {
          content: 'Somewhat oppose',
          key: 'Somewhat oppose'
        }, {
          content: 'Strongly oppose',
          key: 'Strongly oppose'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Do you support or oppose a nationwide mask mandate, which would require all Americans to wear masks indoors during public gatherings ?',
      listAnswer: [
        {
          content: 'Strongly support',
          key: 'Strongly support'
        }, {
          content: 'Somewhat support',
          key: 'Somewhat support'
        }, {
          content: 'Somewhat oppose',
          key: 'Somewhat oppose'
        }, {
          content: 'Strongly oppose',
          key: 'Strongly oppose'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'The Trump Administration launched operation Warp Speed to develop a coronavirus vaccine. Do you think President Trump did a very good job, a good Job, a bad job or a very bad job on the process of developing a coronavirus vaccine ?',
      listAnswer: [
        {
          content: 'Very good job',
          key: 'Very good job'
        }, {
          content: 'Good job',
          key: 'Good job'
        }, {
          content: 'Bad Job',
          key: 'Bad Job'
        }, {
          content: 'Very Bad Job',
          key: 'Very Bad Job'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'In response to the coronavirus, have local and state Governments been to slow to open up, too fast to open up or about right in opening up in response to the coronavirus ?',
      listAnswer: [
        {
          content: 'Too Slow',
          key: 'Too Slow'
        }, {
          content: 'Too Fast',
          key: 'Too Fast'
        }, {
          content: 'About Right',
          key: 'About Right'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Switching to some different issues now ... <br/><br/>\n' +
        '\n' +
        'Would you be more likely or lesss likely to support a company that donates money to the organization Black Lives Matter Incorporated ?',
      listAnswer: [
        {
          content: 'Much More Likely',
          key: 'Much More Likely'
        }, {
          content: 'Somewhat More Likely',
          key: 'Somewhat More Likely'
        }, {
          content: 'Somewhat Less Likely',
          key: 'Somewhat Less Likely'
        }, {
          content: 'Much Less Likely',
          key: 'Much Less Likely'
        }, {
          content: 'No difference',
          key: 'No difference'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'If coronavirus case increase rapidly, do you support or oppose another economic shutdown to try to stop the spread of the virus ?',
      listAnswer: [
        {
          content: 'Strongly support',
          key: 'Strongly support'
        }, {
          content: 'Somewhat support',
          key: 'Somewhat support'
        }, {
          content: 'Somewhat oppose',
          key: 'Somewhat oppose'
        }, {
          content: 'Strongly oppose',
          key: 'Strongly oppose'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Due to the Coronavirus Pandemic there has been growing push by Democrat Governors to conduct the presidential election largely by mail-in voter. Do you support or oppose of states mostly using mail-in voting insteead of in person voting for elections this year ?',
      listAnswer: [
        {
          content: 'Strongly support',
          key: 'Strongly support'
        }, {
          content: 'Somewhat support',
          key: 'Somewhat support'
        }, {
          content: 'Somewhat oppose',
          key: 'Somewhat oppose'
        }, {
          content: 'Strongly oppose',
          key: 'Strongly oppose'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Section 230 of the Communications Decency Act gives Google immunity because they are a platform and not considered a publisher of content. Some claim that Google acts as a publisher because they remove content and censor information. Do you think that Google should be protected by Section 230 and should be treated as a platform, or should they not allowed to censor and remove content because they are a publisher ?',
      listAnswer: [
        {
          content: 'Google should be protected by Section 230 and treated as a platform',
          key: 'Google should be protected by Section 230 and treated as a platform'
        }, {
          content: 'Google should not be allowed to censor and remove content because they are a publisher',
          key: 'Google should not be allowed to censor and remove content because they are a publisher'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'If Socialist Democrats succeed in defunding our police departments, it is likely that you will have to be your own first responder in an emergency. In this possible scenario do you think the Government should increase gun restrictions, decrease gun restrictions, or keep gun laws as they are now ?',
      listAnswer: [
        {
          content: 'Increase Gun Restrictions',
          key: 'Increase Gun Restrictions'
        }, {
          content: 'Decrease Gun Restrictions',
          key: 'Decrease Gun Restrictions'
        }, {
          content: 'Keep Gun Laws as they are now',
          key: 'Keep Gun Laws as they are now'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Please indicate if you agree or disagree with the following statement<br/><br/>' +
        'It\'s is important for Israel to maintain control of the "West Bank" in order to ensure peace and security in the Middle East, especially for Judeo-Christian heritage sites ?',
      listAnswer: [
        {
          content: 'Strongly agree',
          key: 'Strongly agree'
        }, {
          content: 'Somewhat agree',
          key: 'Somewhat agree'
        }, {
          content: 'Somewhat disagree',
          key: 'Somewhat disagree'
        }, {
          content: 'Strongly disagree',
          key: 'Strongly disagree'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'And lastly, switching topics now to Israel and the Middle East ... <br/>' +
        'As you may know, President Trump negotiated a peace deal between Israel and the Muslim countries of the United Arab Emirates and Bahrain. As of result of this historic diplomatic achievement, do you think President Trump should receive the Nobel Peace Prize ?',
      listAnswer: [
        {
          content: 'Yes',
          key: 'Yes'
        }, {
          content: 'No',
          key: 'No'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'For the safety and security of the Middle East, how important is it to you that Israel assert and maintain sovereignty over the country\'s strategic high ground and Judeo-Christian heritage sites ?',
      listAnswer: [
        {
          content: 'Very important',
          key: 'Very important'
        }, {
          content: 'Somewhat important',
          key: 'Somewhat important'
        }, {
          content: 'Not that important',
          key: 'Not that important'
        }, {
          content: 'Not at all important',
          key: 'Not at all important'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'What is your gender ?',
      listAnswer: [
        {
          content: 'Male',
          key: 'Male'
        }, {
          content: 'Female',
          key: 'Female'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Please indicate if you agree or disagree with the following statement<br/>' +
        ' Palestinians would protect freedom of religion and freedom of worship for all faiths in the Middle East',
      listAnswer: [
        {
          content: 'Strongly agree',
          key: 'Strongly agree'
        }, {
          content: 'Somewhat agree',
          key: 'Somewhat agree'
        }, {
          content: 'Somewhat disagree',
          key: 'Somewhat disagree'
        }, {
          content: 'Strongly disagree',
          key: 'Strongly disagree'
        }, {
          content: 'Unsure',
          key: 'Unsure'
        }
      ]
    }, {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'Before we finish, please answer a few short demographic questions for classification purposes only. <br/>Into which of the following categoriees does your age fall ?',
      listAnswer: [
        {
          content: 'Under 18',
          key: 'Under 18'
        }, {
          content: '18-25',
          key: '18-25'
        }, {
          content: '26-40',
          key: '26-40'
        }, {
          content: '41-55',
          key: '41-55'
        }, {
          content: '56-65',
          key: '56-65'
        }, {
          content: '66-75',
          key: '66-75'
        }, {
          content: 'Over 75',
          key: 'Over 75'
        }
      ]
    }
  ]
}

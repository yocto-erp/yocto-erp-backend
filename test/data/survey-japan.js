import {SURVEY_QUESTION_TYPE} from "../../app/db/models/survey/survey-question";
import {SURVEY_TYPE} from "../../app/db/models/survey/survey";

export const SURVEY = {
  name: 'CPAC Japan 2020',
  type: SURVEY_TYPE.PUBLIC,
  remark: '日本最大級の国際政治カンファレンス。',
  languages: [
    {languageId: 1, name: 'CPAC Japan 2020', remark: 'Japan\'s largest international political conference.'}
  ],
  questions: [
    {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'CPAC Japan2020のことはどこで知りましたか',
      languages: [
        {
          languageId: 1, content: 'Where did you find out about CPAC Japan 2020?'
        }
      ],
      listAnswer: [
        {
          content: 'JCUインサイト',
          key: 'JCU Insight',
          languages: [
            {
              languageId: 1, content: 'JCU Insight'
            }
          ]
        }, {
          content: '知人',
          key: 'Word Of Mouth',
          languages: [
            {
              languageId: 1, content: 'Word Of Mouth'
            }
          ]
        }, {
          content: 'JCU公式HP',
          key: 'JCU Website',
          languages: [
            {
              languageId: 1, content: 'JCU Website'
            }
          ]
        }, {
          content: 'その他',
          key: 'Other',
          languages: [
            {
              languageId: 1, content: 'Other'
            }
          ]
        }
      ]
    },
    {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'CPAC Japan2020で最も面白かったセッションはなんですか',
      languages: [
        {
          languageId: 1, content: 'What was the most interesting session at CPAC Japan 2020?'
        }
      ],
      listAnswer: [
        {
          content: 'オープニング/民主主義を守り抜け！',
          key: 'Opening/Fighting for Election Integrity',
          languages: [
            {
              languageId: 1, content: 'Opening / Fighting for Election Integrity'
            }
          ]
        }, {
          content: 'インド太平洋の安定に向けて～安全保障の未来～',
          key: 'The Future of Security Policy',
          languages: [
            {
              languageId: 1, content: 'Toward Stability in Indo-Pacific~The Future of Security Policy'
            }
          ]
        }, {
          content: '米中対立の今！！〜知的財産の問題を中心に〜',
          key: 'Standoff and Protecting Intellectual Property Rights',
          languages: [
            {
              languageId: 1, content: 'The U.S.-China Standoff and Protecting Intellectual Property Rights'
            }
          ]
        }, {
          content: '文化と美徳',
          key: 'Culture and Virtues',
          languages: [
            {
              languageId: 1, content: 'Culture and Virtues'
            }
          ]
        }, {
          content: 'リレー・スピーチ　ポストコロナと日本の未来',
          key: 'Post-Corona and Japan Future',
          languages: [
            {
              languageId: 1, content: 'Keynote Session: Post-Corona and Japan\'s Future'
            }
          ]
        }, {
          content: 'トランプorバイデン　岐路に立つエネルギー地政学',
          key: 'Energy Geopolitics at a Crossroads',
          languages: [
            {
              languageId: 1, content: 'Energy Geopolitics at a Crossroads'
            }
          ]
        }, {
          content: 'DX時代の最先端セキュリティ～デジタル通貨覇権・不正選挙～',
          key: 'The digital transformation-era, cryptocurrency',
          languages: [
            {
              languageId: 1,
              content: 'The digital transformation-era, cryptocurrency system hegemony, and election fraud (Liberty)'
            }
          ]
        }, {
          content: '特になし',
          key: 'Unknown',
          languages: [
            {
              languageId: 1, content: 'I don\'t know'
            }
          ]
        }
      ]
    },
    {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: '日本が現在抱える問題で最も重視するものはなんですか',
      languages: [
        {
          languageId: 1, content: 'What is the most pressing issue facing Japan?'
        }
      ],
      listAnswer: [
        {
          content: '共和党員とのアポイントメント',
          key: 'Declining Birthrate',
          languages: [
            {
              languageId: 1, content: 'Declining Birthrate'
            }
          ]
        }, {
          content: '少子化',
          key: 'Education',
          languages: [
            {
              languageId: 1, content: 'Education'
            }
          ]
        }, {
          content: '教育',
          key: 'Digitalization of Government',
          languages: [
            {
              languageId: 1, content: 'Digitalization of Government'
            }
          ]
        }, {
          content: 'IT',
          key: 'IT',
          languages: [
            {
              languageId: 1, content: 'IT'
            }
          ]
        }, {
          content: '外交',
          key: 'Foreign Affairs',
          languages: [
            {
              languageId: 1, content: 'Foreign Affairs'
            }
          ]
        }, {
          content: '経済',
          key: 'The Economy',
          languages: [
            {
              languageId: 1, content: 'The Economy'
            }
          ]
        },
        {
          content: '行政改革',
          key: 'Governmental Organizational Reform',
          languages: [
            {
              languageId: 1, content: 'Governmental Organizational Reform'
            }
          ]
        },
        {
          content: 'その他',
          key: 'Other',
          languages: [
            {
              languageId: 1, content: 'Other'
            }
          ]
        }
      ]
    },
    {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'アメリカ大統領選挙において、ジョー・バイデンを打ち負かしてトランプ大統領が再選することを支持しますか',
      languages: [
        {
          languageId: 1, content: 'Do you support the reelection of President Trump?'
        }
      ],
      listAnswer: [
        {
          content: '支持する',
          key: 'Support',
          languages: [
            {
              languageId: 1, content: 'Support'
            }
          ]
        },
        {
          content: 'やや支持する',
          key: 'Slightly Support',
          languages: [
            {
              languageId: 1, content: 'Slightly Support'
            }
          ]
        },
        {
          content: 'あまり支持しない',
          key: 'Slightly Oppose',
          languages: [
            {
              languageId: 1, content: 'Slightly Oppose'
            }
          ]
        },
        {
          content: '非常に支持しない',
          key: 'Oppose',
          languages: [
            {
              languageId: 1, content: 'Oppose'
            }
          ]
        },
        {
          content: 'わかならい',
          key: 'I don\'t know',
          languages: [
            {
              languageId: 1, content: 'I don\'t know'
            }
          ]
        }
      ]
    },
    {
      type: SURVEY_QUESTION_TYPE.RADIO,
      content: 'コロナウィルスが今以上に急速に拡大した場合、緊急事態宣言を再び行うことを支持しますか',
      languages: [
        {
          languageId: 1,
          content: 'If COVID-19 cases spike compared to current rates, do you support that the government issuing another state of emergency (in Japan)?'
        }
      ],
      listAnswer: [
        {
          content: '支持する',
          key: 'Support',
          languages: [
            {
              languageId: 1, content: 'Support'
            }
          ]
        },
        {
          content: 'やや支持する',
          key: 'Slightly Support',
          languages: [
            {
              languageId: 1, content: 'Slightly Support'
            }
          ]
        },
        {
          content: 'あまり支持しない',
          key: 'Slightly Oppose',
          languages: [
            {
              languageId: 1, content: 'Slightly Oppose'
            }
          ]
        },
        {
          content: '支持しない',
          key: 'Oppose',
          languages: [
            {
              languageId: 1, content: 'Oppose'
            }
          ]
        },
        {
          content: 'わからない',
          key: 'I don\'t know',
          languages: [
            {
              languageId: 1, content: 'I don\'t know'
            }
          ]
        }
      ]
    }
  ]
}

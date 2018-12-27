import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import * as routes from 'routes-config';

import plus from 'images/Plus.png';
import minus from 'images/Minus.png';
import arrRight from 'images/arrRight.svg';

import { FOURTH_SCREEN } from './constants';
import messages from './messages';

import Section from './Section';

const Box = Section.extend`
  .card {
    border: none;

    .card-header {
      background: transparent;
      padding-left: 0;
      padding-right: 0;

      button {
        display: flex;
        align-items: center;
        text-align: left;
        outline: none;
        color: #282828;
        line-height: 1.33;
        padding: 10px 0;
        cursor: pointer;

        .icon {
          background-size: cover;
          min-width: 30px;
          width: 30px;
          height: 30px;
          margin: 3px 15px 0 0;
          display: inline-block;
          transition: 0.5s;
        }
      }

      button[aria-expanded='true'] .icon.icon-collapse {
        background: url(${minus}) no-repeat;
      }

      button.get-more-answers {
        .icon {
          transition: 0.5s;
          height: 15px !important;
          width: 15px !important;
        }

        :hover {
          color: #f76e5f;
          .icon {
            transform: translate(10px, 0px);
          }
        }
      }

      button[aria-expanded='false'] {
        .icon.icon-collapse {
          background: url(${plus}) no-repeat;
        }

        :hover {
          color: #5c78d7;
          .icon {
            transform: rotate(90deg);
          }
        }
      }
    }

    .card-body {
      padding-left: 3rem;
      font-size: 16px;
    }
  }

  .card.get-more-answers .card-header {
    border: none;
    button {
      color: #fa8072 !important;
    }
  }

  @media only screen and (max-width: 992px) {
    .card h3 {
      font-size: 2.5em;
    }
  }
`;

const QuestionsData = [
  {
    header: 'whatIsPeerania',
    body: 'whatIsPeeraniaCollapsed',
  },
  {
    header: 'howToCreateAcc',
    body: 'howToCreateAccCollapsed',
  },
  {
    header: 'howToUpvote',
    body: 'howToUpvoteCollapsed',
  },
  {
    header: 'whatToPost',
    body: 'whatToPostCollapsed',
  },
  {
    header: 'canIEarn',
    body: 'canIEarnCollapsed',
  },
  {
    header: 'whatIsReputation',
    body: 'whatIsReputationCollapsed',
  },
  {
    header: 'whatIsPeerania',
    body: 'whatIsPeeraniaCollapsed',
  },
  {
    header: 'howToCreateAcc',
    body: 'howToCreateAccCollapsed',
  },
  {
    header: 'howToUpvote',
    body: 'howToUpvoteCollapsed',
  },
  {
    header: 'whatToPost',
    body: 'whatToPostCollapsed',
  },
  {
    header: 'canIEarn',
    body: 'canIEarnCollapsed',
  },
  {
    header: 'whatIsReputation',
    body: 'whatIsReputationCollapsed',
  },
];

export const Question = ({ header, body }) => (
  <div className="card">
    <div className="card-header" id={`heading${header}`}>
      <div>
        <button
          data-toggle="collapse"
          data-target={`#collapse${header}`}
          aria-expanded="false"
          aria-controls={`collapse${header}`}
        >
          <span className="icon icon-collapse" />
          <h3 className="text">
            <FormattedMessage {...messages[header]} />
          </h3>
        </button>
      </div>
      <div
        id={`collapse${header}`}
        className="collapse"
        aria-labelledby={`heading${header}`}
        data-parent="#accordion"
      >
        <div className="card-body">
          <FormattedMessage {...messages[body]} />
        </div>
      </div>
    </div>
  </div>
);

export const Questions = ({ questionsNumber }) =>
  QuestionsData.slice(0, questionsNumber).map(item => (
    <Question key={item.header} {...item} />
  ));

const FaqMain = ({ questionsNumber }) => (
  <Box id={FOURTH_SCREEN}>
    <div className="container">
      <div className="row">
        <div className="col-12 fourth-screen-faq" id="accordion">
          <Questions questionsNumber={questionsNumber} />
          <div className="card get-more-answers">
            <div className="card-header">
              <div className="mb-0">
                <Link to={routes.faq()} href={routes.faq()}>
                  <button className="get-more-answers">
                    <img
                      className="icon icon-getanswers"
                      src={arrRight}
                      alt="arrRight"
                    />
                    <h3 className="text">
                      <FormattedMessage {...messages.getMoreAnswers} />
                    </h3>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Box>
);

FaqMain.propTypes = {
  questionsNumber: PropTypes.number,
};

Question.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
};

export default FaqMain;
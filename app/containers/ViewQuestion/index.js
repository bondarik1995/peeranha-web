/**
 *
 * ViewQuestion
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { translationMessages } from 'i18n';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { scrollToSection } from 'utils/animation';

import * as routes from 'routes-config';

import Seo from 'components/Seo';
import LoadingIndicator from 'components/LoadingIndicator/WidthCentered';

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { makeSelectAccount } from 'containers/AccountProvider/selectors';
import { selectCommunities } from 'containers/DataCacheProvider/selectors';
import { redirectToEditQuestionPage } from 'containers/EditQuestion/actions';
import { redirectToEditAnswerPage } from 'containers/EditAnswer/actions';

import {
  saveComment,
  deleteComment,
  deleteAnswer,
  deleteQuestion,
  getQuestionData,
  postAnswer,
  postComment,
  upVote,
  downVote,
  markAsAccepted,
  voteToDelete,
  resetStore,
} from './actions';

import * as makeSelectViewQuestion from './selectors';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';

import ViewQuestionContainer from './ViewQuestionContainer';

export const ViewQuestion = ({
  locale,
  account,
  questionData,
  postAnswerLoading,
  postCommentLoading,
  questionDataLoading,
  saveCommentLoading,
  communities,
  upVoteLoading,
  downVoteLoading,
  markAsAcceptedLoading,
  deleteQuestionLoading,
  deleteAnswerLoading,
  deleteCommentLoading,
  voteToDeleteLoading,
  postAnswerDispatch,
  deleteAnswerDispatch,
  deleteQuestionDispatch,
  postCommentDispatch,
  saveCommentDispatch,
  deleteCommentDispatch,
  upVoteDispatch,
  downVoteDispatch,
  markAsAcceptedDispatch,
  voteToDeleteDispatch,
  getQuestionDataDispatch,
  redirectToEditQuestionPageDispatch,
  redirectToEditAnswerPageDispatch,
  ids,
  resetStoreDispatch,
  match,
  history,
}) => {
  useEffect(() => {
    window.isRendered = false;
    resetStoreDispatch();
    getQuestionDataDispatch(match.params.id);

    return () => {
      window.$(window).off();
    };
  }, []);

  useEffect(
    () => {
      if (questionData) {
        setTimeout(scrollToSection, 250);
      }

      if (questionData && !questionDataLoading) {
        window.isRendered = true;
      }

      if (!questionDataLoading && !questionData) {
        history.push(routes.notFound());
      }
    },
    [questionData, questionDataLoading],
  );

  const translations = translationMessages[locale];

  const sendProps = {
    account,
    locale,
    communities,
    questionData,
    postAnswerLoading,
    postCommentLoading,
    saveCommentLoading,
    postAnswer: postAnswerDispatch,
    deleteAnswer: deleteAnswerDispatch,
    deleteQuestion: deleteQuestionDispatch,
    postComment: postCommentDispatch,
    saveComment: saveCommentDispatch,
    deleteComment: deleteCommentDispatch,
    upVote: upVoteDispatch,
    downVote: downVoteDispatch,
    markAsAccepted: markAsAcceptedDispatch,
    voteToDelete: voteToDeleteDispatch,
    translations,
    upVoteLoading,
    downVoteLoading,
    markAsAcceptedLoading,
    deleteQuestionLoading,
    deleteAnswerLoading,
    deleteCommentLoading,
    voteToDeleteLoading,
    redirectToEditQuestionPage: redirectToEditQuestionPageDispatch,
    redirectToEditAnswerPage: redirectToEditAnswerPageDispatch,
    ids,
  };

  const helmetTitle =
    (questionData && questionData.content.title) ||
    translations[messages.title.id];

  const helmetDescription =
    (questionData && questionData.content.content) ||
    translations[messages.title.id];

  const articlePublishedTime =
    questionData && questionData.post_time
      ? new Date(questionData.post_time * 1000)
      : ``;

  const articleModifiedTime =
    questionData && questionData.lastEditedDate
      ? new Date(questionData.lastEditedDate * 1000)
      : ``;

  const tagIds = questionData ? questionData.tags : [];

  const commId = questionData ? questionData.community_id : null;

  const community = communities.filter(x => x.id === commId)[0] || {
    tags: [],
  };

  const tags = community.tags.filter(x => tagIds.includes(x.id));

  const keywords = [...tags.map(x => x.name), helmetTitle];

  return (
    <React.Fragment>
      <Seo
        title={helmetTitle}
        description={helmetDescription}
        language={locale}
        keywords={keywords}
        articlePublishedTime={articlePublishedTime}
        articleModifiedTime={articleModifiedTime}
      />

      {!questionDataLoading &&
        questionData && <ViewQuestionContainer {...sendProps} />}

      {questionDataLoading && <LoadingIndicator />}
    </React.Fragment>
  );
};

ViewQuestion.propTypes = {
  account: PropTypes.string,
  locale: PropTypes.string,
  communities: PropTypes.array,
  questionDataLoading: PropTypes.bool,
  postAnswerLoading: PropTypes.bool,
  postCommentLoading: PropTypes.bool,
  saveCommentLoading: PropTypes.bool,
  questionData: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  getQuestionDataDispatch: PropTypes.func,
  postAnswerDispatch: PropTypes.func,
  postCommentDispatch: PropTypes.func,
  upVoteDispatch: PropTypes.func,
  downVoteDispatch: PropTypes.func,
  markAsAcceptedDispatch: PropTypes.func,
  deleteQuestionDispatch: PropTypes.func,
  deleteAnswerDispatch: PropTypes.func,
  saveCommentDispatch: PropTypes.func,
  deleteCommentDispatch: PropTypes.func,
  voteToDeleteDispatch: PropTypes.func,
  resetStoreDispatch: PropTypes.func,
  upVoteLoading: PropTypes.bool,
  downVoteLoading: PropTypes.bool,
  markAsAcceptedLoading: PropTypes.bool,
  deleteQuestionLoading: PropTypes.bool,
  deleteAnswerLoading: PropTypes.bool,
  deleteCommentLoading: PropTypes.bool,
  voteToDeleteLoading: PropTypes.bool,
  redirectToEditQuestionPageDispatch: PropTypes.func,
  redirectToEditAnswerPageDispatch: PropTypes.func,
  ids: PropTypes.array,
};

const withConnect = connect(
  createStructuredSelector({
    account: makeSelectAccount(),
    locale: makeSelectLocale(),
    communities: selectCommunities(),
    questionDataLoading: makeSelectViewQuestion.selectQuestionDataLoading(),
    questionData: makeSelectViewQuestion.selectQuestionData(),
    postCommentLoading: makeSelectViewQuestion.selectPostCommentLoading(),
    postAnswerLoading: makeSelectViewQuestion.selectPostAnswerLoading(),
    saveCommentLoading: makeSelectViewQuestion.selectSaveCommentLoading(),
    upVoteLoading: makeSelectViewQuestion.selectUpVoteLoading(),
    downVoteLoading: makeSelectViewQuestion.selectDownVoteLoading(),
    markAsAcceptedLoading: makeSelectViewQuestion.selectMarkAsAcceptedLoading(),
    deleteQuestionLoading: makeSelectViewQuestion.selectDeleteQuestionLoading(),
    deleteAnswerLoading: makeSelectViewQuestion.selectDeleteAnswerLoading(),
    deleteCommentLoading: makeSelectViewQuestion.selectDeleteCommentLoading(),
    voteToDeleteLoading: makeSelectViewQuestion.selectVoteToDeleteLoading(),
    ids: makeSelectViewQuestion.selectIds(),
  }),
  (
    dispatch,
    {
      match: {
        params: { id: questionId },
      },
    },
  ) => ({
    postAnswerDispatch: bindActionCreators(
      postAnswer.bind(null, questionId),
      dispatch,
    ),
    deleteAnswerDispatch: bindActionCreators(
      deleteAnswer.bind(null, questionId),
      dispatch,
    ),
    deleteQuestionDispatch: bindActionCreators(
      deleteQuestion.bind(null, questionId),
      dispatch,
    ),
    postCommentDispatch: bindActionCreators(
      postComment.bind(null, questionId),
      dispatch,
    ),
    saveCommentDispatch: bindActionCreators(
      saveComment.bind(null, questionId),
      dispatch,
    ),
    deleteCommentDispatch: bindActionCreators(
      deleteComment.bind(null, questionId),
      dispatch,
    ),
    upVoteDispatch: bindActionCreators(upVote.bind(null, questionId), dispatch),
    downVoteDispatch: bindActionCreators(
      downVote.bind(null, questionId),
      dispatch,
    ),
    markAsAcceptedDispatch: bindActionCreators(
      markAsAccepted.bind(null, questionId),
      dispatch,
    ),
    voteToDeleteDispatch: bindActionCreators(
      voteToDelete.bind(null, questionId),
      dispatch,
    ),
    getQuestionDataDispatch: bindActionCreators(getQuestionData, dispatch),
    resetStoreDispatch: bindActionCreators(resetStore, dispatch),
    redirectToEditQuestionPageDispatch: bindActionCreators(
      redirectToEditQuestionPage,
      dispatch,
    ),
    redirectToEditAnswerPageDispatch: bindActionCreators(
      redirectToEditAnswerPage,
      dispatch,
    ),
  }),
);

const withReducer = injectReducer({ key: 'viewQuestion', reducer });
const withSaga = injectSaga({ key: 'viewQuestion', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ViewQuestion);

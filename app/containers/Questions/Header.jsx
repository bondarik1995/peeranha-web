import React from 'react';
import PropTypes from 'prop-types';
import * as routes from 'routes-config';

import { injectIntl, intlShape } from 'react-intl';
import messages from 'common-messages';

import FollowCommunityButton from 'containers/FollowCommunityButton/DefaultButton';

import CommunitySelector from 'components/CommunitySelector';
import { MediumImageStyled } from 'components/Img/MediumImage';
import H3 from 'components/H3';
import Wrapper from 'components/Header/Simple';

import allquestionsIcon from 'images/allquestions-header.svg?inline';
import myFeedIcon from 'images/myFeedHeader.svg?inline';
import createdHistory from 'createdHistory';
import { isSingleCommunityWebsite } from 'utils/communityManagement';

export const Header = ({
  intl,
  communityIdFilter,
  followedCommunities,
  parentPage,
  setTypeFilter,
}) => {
  const isFeed = parentPage === routes.feed();

  let defaultAvatar = null;
  let defaultLabel = null;

  if (!isFeed) {
    defaultAvatar = allquestionsIcon;
    defaultLabel = intl.formatMessage({ id: messages.questions.id });
  } else {
    defaultAvatar = myFeedIcon;
    defaultLabel = intl.formatMessage({ id: messages.myFeed.id });
  }

  /* eslint react/prop-types: 0 */
  const Button = ({ communityAvatar, communityLabel }) => (
    <H3>
      <MediumImageStyled
        src={communityAvatar || defaultAvatar}
        alt="communityAvatar"
      />
      <span>{communityLabel || defaultLabel}</span>
    </H3>
  );

  const singleCommId = isSingleCommunityWebsite();

  const displaySubscribeButton =
    singleCommId ||
    (!isFeed && window.location.pathname !== routes.questions());

  return (
    <Wrapper
      single={singleCommId}
      className="d-flex justify-content-start mb-to-sm-0 mb-from-sm-3"
      isColumnForSM
    >
      <div className={`mr-${singleCommId ? 3 : 4}`}>
        <CommunitySelector
          isArrowed
          Button={Button}
          toggle={choice => {
            createdHistory.push(
              routes[isFeed ? 'feed' : 'questions'](choice, false, false),
            );
            setTypeFilter(choice);
          }}
          showOnlyFollowed={isFeed}
          selectedCommunityId={communityIdFilter}
        />
      </div>
      {displaySubscribeButton ? (
        <div className="right-panel m-0">
          <FollowCommunityButton
            communityIdFilter={singleCommId || communityIdFilter}
            followedCommunities={followedCommunities}
          />
        </div>
      ) : null}
    </Wrapper>
  );
};

Header.propTypes = {
  intl: intlShape.isRequired,
  communityIdFilter: PropTypes.number,
  followedCommunities: PropTypes.array,
  parentPage: PropTypes.string,
  setTypeFilter: PropTypes.func,
};

export default injectIntl(React.memo(Header));

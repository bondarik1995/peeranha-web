import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as routes from 'routes-config';

import commonMessages from 'common-messages';
import { TEXT_PRIMARY } from 'style-constants';

import createCommunityIcon from 'images/createCommunity.svg?inline';
import addIcon from 'images/addBlue.svg?inline';

import Span from 'components/Span';
import SubHeaderWrapper from 'components/Header/Complex';
import NavigationButton from 'components/Button/Contained/Navigation';
import A from 'components/A';

import messages from './messages';
import languages from './languagesOptions';
import { GO_TO_CREATE_COMMUNITY_SCREEN_BUTTON_ID } from './constants';

const suggestedCommunitiesRoute = routes.suggestedCommunities();
const communitiesRoute = routes.communities();

const Header = ({
  goToCreateCommunityScreen,
  SubHeader,
  changeSorting,
  sorting,
  communitiesNumber,
  setLang,
  language,
}) => {
  const path = window.location.pathname + window.location.hash;

  return (
    <div className="mb-to-sm-0 mb-from-sm-3">
      <SubHeaderWrapper position="top">
        <div>
          <A to={communitiesRoute} href={communitiesRoute}>
            <NavigationButton isLink={path !== communitiesRoute}>
              <FormattedMessage {...commonMessages.communities} />
            </NavigationButton>
          </A>

          <A to={suggestedCommunitiesRoute} href={suggestedCommunitiesRoute}>
            <NavigationButton isLink={path !== suggestedCommunitiesRoute}>
              <FormattedMessage {...messages.voting} />
            </NavigationButton>
          </A>
        </div>

        <div className="right-panel">
          <button
            id={`${GO_TO_CREATE_COMMUNITY_SCREEN_BUTTON_ID}_header`}
            onClick={goToCreateCommunityScreen}
            className="d-flex align-items-center"
          >
            <img
              className="d-none d-sm-inline-block"
              src={createCommunityIcon}
              alt="icon"
            />
            <img
              className="d-inline-block d-sm-none"
              src={addIcon}
              alt="icon"
            />
            <Span className="ml-1" color={TEXT_PRIMARY}>
              <FormattedMessage {...messages.suggestCommunity} />
            </Span>
          </button>
        </div>
      </SubHeaderWrapper>

      <SubHeader
        changeSorting={changeSorting}
        sorting={sorting}
        communitiesNumber={communitiesNumber}
        setLang={setLang}
        language={language}
        languages={languages}
      />
    </div>
  );
};

Header.propTypes = {
  goToCreateCommunityScreen: PropTypes.func,
  SubHeader: PropTypes.any,
  changeSorting: PropTypes.func,
  sorting: PropTypes.object,
  communitiesNumber: PropTypes.number,
  setLang: PropTypes.func,
  language: PropTypes.object,
};

export default Header;
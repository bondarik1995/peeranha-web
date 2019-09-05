/**
 *
 * LeftMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import * as routes from 'routes-config';
import styled from 'styled-components';
import { TEXT_LIGHT, TEXT_PRIMARY_DARK } from 'style-constants';

import closeIcon from 'images/close.svg?external';
import Icon from 'components/Icon';
import Span from 'components/Span';

import { LEFT_MENU_WIDTH } from 'containers/App/constants';
import { makeSelectProfileInfo } from 'containers/AccountProvider/selectors';
import { selectPrivacyPolicy } from 'containers/PrivacyPolicy/selectors';

import FixedContentForPrivacyPolicy from 'containers/PrivacyPolicy/LeftMenu';

import FixedContent from './FixedContent';

/* istanbul ignore next */
const Aside = styled.aside`
  ${props =>
    props.isMenuVisible
      ? `
    width: 100%;
    min-height: 100vh;`
      : `
    flex: 0 0 ${LEFT_MENU_WIDTH}px;
    margin-top: 15px;
    margin-right: 15px;
  `};
`;

const After = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 50px;
  height: 100vh;
  z-index: 9999;
  background: ${TEXT_PRIMARY_DARK}E6;
  display: flex;
  justify-content: center;
  padding: 25px 0;
`;

const LeftMenu = /* istanbul ignore next */ ({
  profile,
  isMenuVisible,
  isNavigationExpanded,
  showMenu,
  privacyPolicy,
}) => {
  const { pathname } = window.location;

  return (
    <Aside
      isMenuVisible={isMenuVisible}
      className={`${isMenuVisible ? 'd-block' : 'd-none d-lg-block'}`}
    >
      {pathname === routes.privacyPolicy() ? (
        <FixedContentForPrivacyPolicy
          isMenuVisible={isMenuVisible}
          privacyPolicy={privacyPolicy}
        />
      ) : (
        <FixedContent
          isNavigationExpanded={isNavigationExpanded}
          isMenuVisible={isMenuVisible}
          profile={profile}
        />
      )}

      {isMenuVisible && (
        <After onClick={showMenu}>
          <Span color={TEXT_LIGHT}>
            <Icon width="16" icon={closeIcon} noMargin />
          </Span>
        </After>
      )}
    </Aside>
  );
};

LeftMenu.propTypes = {
  profile: PropTypes.object,
  isMenuVisible: PropTypes.bool,
  isNavigationExpanded: PropTypes.bool,
  showMenu: PropTypes.func,
  privacyPolicy: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfileInfo(),
  privacyPolicy: selectPrivacyPolicy(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(withConnect)(LeftMenu);

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Wrapper from 'components/Header/Complex';
import H3 from 'components/H3';

import messages from 'containers/Profile/messages';

const Header = () => (
  <Wrapper className="mb-to-sm-0 mb-from-sm-3" position="bottom">
    <H3>
      <FormattedMessage {...messages.youAnswered} />
    </H3>
  </Wrapper>
);

export default Header;
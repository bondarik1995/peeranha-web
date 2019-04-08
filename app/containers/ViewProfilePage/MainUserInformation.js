import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import * as routes from 'routes-config';

import { getFormattedDate } from 'utils/datetime';

import noAvatar from 'images/noAvatar.png';
import editUserNoAvatar from 'images/editUserNoAvatar.png';

import questionRoundedIcon from 'svg/question2';
import answerIcon from 'svg/answer';
import pencilIcon from 'svg/pencil';
import risenIcon from 'svg/risen';

import Base from 'components/Base';
import Ul from 'components/Ul';
import Li from 'components/Li';
import Span from 'components/Span';
import RatingStatus from 'components/RatingStatus';
import H3 from 'components/H3';
import A from 'components/A';
import NavigationButton from 'components/Button/NavigationButton';
import Icon from 'components/Icon';

import LargeImage from 'components/Img/LargeImage';

import messages from 'containers/Profile/messages';
import commonMessages from 'common-messages';

const UlStyled = Ul.extend`
  display: flex;
  flex-wrap: wrap;
  border: none;
  padding: 0;
`;

/* istanbul ignore next */
const LiStyled = Li.extend`
  display: flex;
  flex-direction: column;
  padding: 16px ${props => (props.last ? '0' : '47px')} 16px 0;
`;

const MainUserInformation = /* istanbul ignore next */ ({
  profile,
  userId,
  account,
}) => (
  <Base position="middle">
    <div className="row">
      <div className="col-12 col-lg-3 col-xl-2 d-flex justify-content-center">
        <LargeImage
          src={
            profile.ipfs_avatar ||
            (userId === account ? editUserNoAvatar : noAvatar)
          }
          alt="avatar"
          isBordered
        />
      </div>

      <div className="col-12 col-lg-9 col-xl-10">
        <div className="d-flex justify-content-between align-items-center">
          <H3>{profile.display_name}</H3>

          <A to={routes.profileEdit(userId)} href={routes.profileEdit(userId)}>
            <NavigationButton isLink>
              <Icon className="mr-2" icon={pencilIcon} />
              <FormattedMessage {...commonMessages.edit} />
            </NavigationButton>
          </A>
        </div>

        <div className="d-flex align-items-center">
          <UlStyled>
            <LiStyled>
              <Span color="gray" fontSize="13">
                <FormattedMessage {...messages.reputation} />
              </Span>
              <RatingStatus rating={profile.rating} size="lg" />
            </LiStyled>

            <LiStyled>
              <Span color="gray" fontSize="13">
                <FormattedMessage {...commonMessages.questions} />
              </Span>
              <Span
                className="d-flex align-items-center"
                fontSize="20"
                margin="sm"
                bold
              >
                <Icon
                  icon={questionRoundedIcon}
                  className="d-flex align-items-center mr-1"
                />
                <span>{profile.questions_asked || 0}</span>
              </Span>
            </LiStyled>

            <LiStyled>
              <Span color="gray" fontSize="13">
                <FormattedMessage {...commonMessages.answers} />
              </Span>
              <Span
                className="d-flex align-items-center"
                fontSize="20"
                margin="sm"
                bold
              >
                <Icon
                  icon={answerIcon}
                  className="d-flex align-items-center mr-1"
                />
                <span>{profile.answers_given || 0}</span>
              </Span>
            </LiStyled>

            <LiStyled>
              <Span color="gray" fontSize="13">
                <FormattedMessage {...messages.risen} />
              </Span>
              <Span
                className="d-flex align-items-center"
                fontSize="20"
                margin="sm"
                bold
              >
                <Icon
                  icon={risenIcon}
                  className="d-flex align-items-center mr-1"
                />
                <span>{profile.correct_answers || 0}</span>
              </Span>
            </LiStyled>

            <LiStyled last>
              <Span color="gray" fontSize="13">
                <FormattedMessage {...messages.memberSince} />
                <span>{getFormattedDate(profile.registration_time)}</span>
              </Span>
            </LiStyled>
          </UlStyled>
        </div>
      </div>
    </div>
  </Base>
);

MainUserInformation.propTypes = {
  profile: PropTypes.object,
  userId: PropTypes.string,
  account: PropTypes.string,
};

export default React.memo(MainUserInformation);
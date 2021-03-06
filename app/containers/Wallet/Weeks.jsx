import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import { TEXT_WARNING_LIGHT, TEXT_SECONDARY } from 'style-constants';

import { getFormattedNum3 } from 'utils/numbers';
import { getFormattedDate } from 'utils/datetime';
import { FULL_MONTH_NAME_DAY_YEAR, DD_MM_YY } from 'utils/constants';

import calendarImage from 'images/calendar.svg?inline';
import currencyPeerImage from 'images/currencyPeer.svg?inline';

import P from 'components/P';
import Span from 'components/Span';
import Base from 'components/Base';
import LoadingIndicator from 'components/LoadingIndicator/WidthCentered';
import BaseRounded from 'components/Base/BaseRounded';
import SmallImage from 'components/Img/SmallImage';
import PickupButton from 'components/Button/Contained/InfoLarge';
import ReceivedButton from 'components/Button/Contained/SecondaryLarge';

import messages from './messages';
import { makeSelectProfileInfo } from '../AccountProvider/selectors';

const BaseRoundedLi = BaseRounded.extend`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > * {
    flex: 1;
  }

  ${PickupButton}, ${ReceivedButton} {
    min-width: 140px;
  }
`.withComponent('li');

const WeekNumber = ({
  period,
  locale,
  periodStarted,
  periodFinished,
  currentWeeksNumber,
}) => {
  let week = ` ${period + 1}`;

  if (currentWeeksNumber === 2) {
    week = ` ${period + 1}-${period + 2}`;
  }

  return (
    <P>
      <Span className="mr-3" fontSize="24" mobileFS={21} bold>
        <FormattedMessage {...messages.week} /> {week}
      </Span>

      <Span className="d-none d-md-inline-block">
        {getFormattedDate(periodStarted, locale, FULL_MONTH_NAME_DAY_YEAR)}
        {' — '}
        {getFormattedDate(periodFinished, locale, FULL_MONTH_NAME_DAY_YEAR)}
      </Span>

      <Span className="d-inline-block d-md-none" mobileFS={14}>
        {getFormattedDate(periodStarted, locale, DD_MM_YY)}
        {' — '}
        {getFormattedDate(periodFinished, locale, DD_MM_YY)}
      </Span>
    </P>
  );
};

const CurrentWeek = ({
  period,
  locale,
  periodStarted,
  periodFinished,
  currentWeeksNumber,
}) => (
  <li className="flex-grow-1 mb-3">
    <Base position="top">
      <P className="mb-1" color={TEXT_WARNING_LIGHT} fontSize="13">
        <FormattedMessage
          {...messages[period ? 'currentPeriod' : 'registrationWeek']}
        />
      </P>
      <WeekNumber
        currentWeeksNumber={currentWeeksNumber}
        locale={locale}
        period={period}
        periodStarted={periodStarted}
        periodFinished={periodFinished}
      />
    </Base>
    <Base className="d-flex align-items-center" position="bottom">
      <img className="mr-3" src={calendarImage} alt="calendar" />
      <Span mobileFS={14}>
        <FormattedMessage
          {...messages[
            currentWeeksNumber
              ? 'periodStillInProgress'
              : 'thisIsRegistrationWeek'
          ]}
        />
      </Span>
    </Base>
  </li>
);

const PendingWeek = ({
  period,
  reward,
  locale,
  periodStarted,
  periodFinished,
  registrationWeek,
}) => (
  <li className="flex-grow-1 mb-3">
    <Base position="top">
      <P className="mb-1" color={TEXT_WARNING_LIGHT} fontSize="13">
        <FormattedMessage
          {...messages[registrationWeek ? 'registrationWeek' : 'payoutPending']}
        />
      </P>
      <WeekNumber
        locale={locale}
        period={period}
        periodStarted={periodStarted}
        periodFinished={periodFinished}
      />
    </Base>
    <Base position="bottom">
      {!registrationWeek ? (
        <>
          <P className="mb-1" fontSize="14" color={TEXT_SECONDARY}>
            <FormattedMessage {...messages.estimatedPayout} />
          </P>
          <P className="d-flex align-items-center">
            <SmallImage className="mr-2" src={currencyPeerImage} alt="icon" />
            <Span fontSize="20" mobileFS={14} bold>
              {getFormattedNum3(reward)}
            </Span>
          </P>
        </>
      ) : (
        <P>
          <FormattedMessage {...messages.thisIsRegistrationWeek} />
        </P>
      )}
    </Base>
  </li>
);

const PaidOutWeek = ({
  period,
  reward,
  locale,
  hasTaken,
  pickupRewardDispatch,
  pickupRewardProcessing,
  periodStarted,
  periodFinished,
  ids,
  registrationWeek,
}) => (
  <BaseRoundedLi className="align-items-center mb-3">
    <div>
      <P fontSize="13" color={TEXT_SECONDARY}>
        <FormattedMessage
          {...messages[registrationWeek ? 'registrationWeek' : 'paidOut']}
        />
      </P>
      <WeekNumber
        locale={locale}
        period={period}
        periodStarted={periodStarted}
        periodFinished={periodFinished}
      />
    </div>

    {!registrationWeek ? (
      <div className="d-flex align-items-center justify-content-end">
        <P className="d-flex align-items-center">
          <SmallImage className="mr-2" src={currencyPeerImage} alt="icon" />
          <Span fontSize="20" mobileFS={14} bold>
            {getFormattedNum3(reward)}
          </Span>
        </P>

        {!hasTaken && (
          <PickupButton
            className="ml-4"
            id={`pickup-reward-${period}`}
            onClick={() =>
              pickupRewardDispatch(period, `pickup-reward-${period}`)
            }
            disabled={
              hasTaken !== false ||
              !Number(reward) ||
              (pickupRewardProcessing &&
                ids.includes(`pickup-reward-${period}`))
            }
          >
            <FormattedMessage {...messages.getReward} />
          </PickupButton>
        )}

        {hasTaken && (
          <ReceivedButton className="ml-4">
            <FormattedMessage {...messages.received} />
          </ReceivedButton>
        )}
      </div>
    ) : (
      <div className="d-flex justify-content-end">
        <P>
          <FormattedMessage {...messages.yourWalletWasSuccessfullySet} />
        </P>
      </div>
    )}
  </BaseRoundedLi>
);

const CurrentPendingWeeks = styled.div`
  display: ${x => (x.inRow ? 'flex' : 'block')};
  align-items: stretch;

  > :nth-child(1) {
    flex: 1;
    margin-right: ${x => (x.inRow ? '10px' : '0px')};

    > div {
      height: 50%;
    }
  }

  > :nth-child(2) {
    flex: 1;
    margin-left: ${x => (x.inRow ? '10px' : '0px')};

    > div {
      height: 50%;
    }
  }

  @media only screen and (max-width: 768px) {
    display: block;

    > * {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }
  }
`;

/* eslint indent: 0 */
const Weeks = ({
  locale,
  weekStat,
  getWeekStatProcessing,
  pickupRewardDispatch,
  pickupRewardProcessing,
  ids,
  profile,
}) => {
  const currentWeeksNumber = weekStat && ((weekStat[0] && 1) || 0);

  const pendingWeek = weekStat ? weekStat[1] : null;

  return (
    <>
      {weekStat &&
        !getWeekStatProcessing && (
          <ul className="mt-3">
            <CurrentPendingWeeks inRow={weekStat.length >= 2}>
              {weekStat.length > 1 ? (
                <CurrentWeek
                  currentWeeksNumber={currentWeeksNumber}
                  locale={locale}
                  {...weekStat[currentWeeksNumber === 2 ? 1 : 0]}
                  periodFinished={weekStat[0].periodFinished}
                />
              ) : (
                <CurrentWeek
                  currentWeeksNumber={0}
                  locale={locale}
                  period={0}
                  periodStarted={profile.registration_time}
                  periodFinished={
                    profile.registration_time + +process.env.WEEK_DURATION
                  }
                />
              )}

              {pendingWeek && (
                <PendingWeek
                  locale={locale}
                  registrationWeek={pendingWeek && weekStat.length === 2}
                  {...pendingWeek}
                />
              )}
            </CurrentPendingWeeks>

            {weekStat
              .slice(2)
              .map((x, index, arr) => (
                <PaidOutWeek
                  pickupRewardDispatch={pickupRewardDispatch}
                  pickupRewardProcessing={pickupRewardProcessing}
                  locale={locale}
                  ids={ids}
                  {...x}
                  registrationWeek={index === arr.length - 1}
                />
              ))}
          </ul>
        )}

      {getWeekStatProcessing && <LoadingIndicator />}
    </>
  );
};

WeekNumber.propTypes = {
  period: PropTypes.number,
  locale: PropTypes.string,
  periodStarted: PropTypes.number,
  periodFinished: PropTypes.number,
  currentWeeksNumber: PropTypes.number,
};

CurrentWeek.propTypes = {
  period: PropTypes.number,
  locale: PropTypes.string,
  periodStarted: PropTypes.number,
  periodFinished: PropTypes.number,
  currentWeeksNumber: PropTypes.number,
};

PendingWeek.propTypes = {
  period: PropTypes.string,
  locale: PropTypes.string,
  reward: PropTypes.string,
  periodStarted: PropTypes.number,
  periodFinished: PropTypes.number,
  registrationWeek: PropTypes.bool,
};

PaidOutWeek.propTypes = {
  period: PropTypes.string,
  locale: PropTypes.string,
  reward: PropTypes.string,
  hasTaken: PropTypes.bool,
  pickupRewardDispatch: PropTypes.func,
  pickupRewardProcessing: PropTypes.bool,
  periodStarted: PropTypes.number,
  periodFinished: PropTypes.number,
  ids: PropTypes.array,
  registrationWeek: PropTypes.bool,
};

Weeks.propTypes = {
  weekStat: PropTypes.array,
  ids: PropTypes.array,
  locale: PropTypes.string,
  pickupRewardDispatch: PropTypes.func,
  getWeekStatProcessing: PropTypes.bool,
  pickupRewardProcessing: PropTypes.bool,
  profile: PropTypes.object,
};

export default React.memo(
  connect(state => ({
    profile: makeSelectProfileInfo()(state),
  }))(Weeks),
);

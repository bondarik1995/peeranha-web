import { call, put, takeLatest, select } from 'redux-saga/effects';
import { translationMessages } from 'i18n';

import createdHistory from 'createdHistory';
import * as routes from 'routes-config';

import { setCookie } from 'utils/cookie';
import {
  registerAccount,
  inviteUser,
  isUserInSystem,
} from 'utils/accountManagement';
import { login } from 'utils/web_integration/src/wallet/login/login';
import webIntegrationErrors from 'utils/web_integration/src/wallet/service-errors';
import { WebIntegrationError, ApplicationError } from 'utils/errors';
import {
  followCommunity,
  isSingleCommunityWebsite,
} from 'utils/communityManagement';

import { selectEos } from 'containers/EosioProvider/selectors';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import {
  getCurrentAccountWorker,
  getReferralInfo,
} from 'containers/AccountProvider/saga';
import { showScatterSignUpFormWorker } from 'containers/SignUp/saga';

import { ACCOUNT_NOT_CREATED_NAME } from 'containers/SignUp/constants';
import { makeSelectProfileInfo } from 'containers/AccountProvider/selectors';
import { hideLeftMenu } from 'containers/AppWrapper/actions';
import { selectIsMenuVisible } from 'containers/AppWrapper/selectors';

import {
  loginWithEmailSuccess,
  loginWithEmailErr,
  loginWithScatterSuccess,
  loginWithScatterErr,
  finishRegistrationWithDisplayNameSuccess,
  finishRegistrationWithDisplayNameErr,
  hideLoginModal,
  finishRegistrationReferralErr,
} from './actions';

import {
  FINISH_REGISTRATION,
  LOGIN_WITH_EMAIL,
  LOGIN_WITH_SCATTER,
  SCATTER_MODE_ERROR,
  USER_IS_NOT_SELECTED,
  USER_IS_NOT_REGISTERED,
  EMAIL_FIELD,
  PASSWORD_FIELD,
  REMEMBER_ME_FIELD,
  WE_ARE_HAPPY_FORM,
  DISPLAY_NAME,
  AUTOLOGIN_DATA,
  REFERRAL_CODE,
} from './constants';

import messages from './messages';
import { makeSelectEosAccount } from './selectors';
import { addToast } from '../Toast/actions';
import { initEosioSuccess } from '../EosioProvider/actions';
import { getNotificationsInfoWorker } from '../../components/Notifications/saga';

/* eslint consistent-return: 0 */
export function* loginWithEmailWorker({ val }) {
  try {
    const locale = yield select(makeSelectLocale());
    const translations = translationMessages[locale];

    const email = val[EMAIL_FIELD];
    const password = val[PASSWORD_FIELD];
    const rememberMe = Boolean(val[REMEMBER_ME_FIELD]);

    const response = yield call(login, email, password, rememberMe);

    if (!response.OK) {
      throw new WebIntegrationError(
        translations[webIntegrationErrors[response.errorCode].id],
      );
    }

    const { activeKey, eosAccountName } = response.body;

    if (eosAccountName === ACCOUNT_NOT_CREATED_NAME) {
      throw new WebIntegrationError(
        translations[messages.accountNotCreatedName.id],
      );
    }

    yield call(getCurrentAccountWorker, eosAccountName);
    const profileInfo = yield select(makeSelectProfileInfo());

    yield put(loginWithEmailSuccess());

    // If user is absent - show window to finish registration
    if (!profileInfo) {
      yield put(loginWithEmailSuccess(eosAccountName, WE_ARE_HAPPY_FORM));
    }

    const eosService = yield select(selectEos);

    yield call(
      eosService.initEosioWithoutScatter,
      activeKey.private,
      eosAccountName,
    );

    yield call(getNotificationsInfoWorker, profileInfo.user);

    yield put(initEosioSuccess(eosService));
  } catch (err) {
    yield put(loginWithEmailErr(err));
  }
}

export function* loginWithScatterWorker() {
  try {
    const eosService = yield select(selectEos);
    const locale = yield select(makeSelectLocale());
    const translations = translationMessages[locale];

    yield call(eosService.forgetIdentity);
    yield call(eosService.initEosioWithScatter);

    if (!eosService.scatterInstalled) {
      throw new WebIntegrationError(
        translations[messages[SCATTER_MODE_ERROR].id],
      );
    }

    if (!eosService.selectedAccount) {
      throw new WebIntegrationError(
        translations[messages[USER_IS_NOT_SELECTED].id],
      );
    }

    yield call(getCurrentAccountWorker, eosService.selectedAccount);
    const profileInfo = yield select(makeSelectProfileInfo());

    if (!profileInfo) {
      yield call(showScatterSignUpFormWorker);

      yield put(hideLoginModal());

      throw new ApplicationError(
        translations[messages[USER_IS_NOT_REGISTERED].id],
      );
    }

    yield call(getNotificationsInfoWorker, profileInfo.user);

    setCookie({
      name: AUTOLOGIN_DATA,
      value: JSON.stringify({ loginWithScatter: true }),
      options: {
        allowSubdomains: true,
        defaultPath: true,
      },
    });

    yield put(loginWithScatterSuccess());
  } catch (err) {
    yield put(loginWithScatterErr(err));
  }
}

export function* sendReferralCode(
  accountName,
  referralCode,
  eosService,
  error,
) {
  const info = yield call(getReferralInfo, accountName, eosService);
  if (info) {
    return true;
  }
  const isUserIn = yield call(isUserInSystem, referralCode, eosService);

  if (isUserIn) {
    try {
      yield call(inviteUser, accountName, referralCode, eosService);
    } catch (err) {
      yield put(error(err));
      return;
    }
    return true;
  }
  const locale = yield select(makeSelectLocale());
  const text = translationMessages[locale][messages.inviterIsNotRegisterYet.id];
  yield put(addToast({ type: 'error', text }));
  yield put(error(new Error(text)));
}

export function* finishRegistrationWorker({ val }) {
  try {
    const eosService = yield select(selectEos);
    const accountName = yield select(makeSelectEosAccount());

    const profile = {
      accountName,
      displayName: val[DISPLAY_NAME],
    };
    const referralCode = val[REFERRAL_CODE];

    if (referralCode) {
      const ok = yield call(
        sendReferralCode,
        accountName,
        referralCode,
        eosService,
        finishRegistrationReferralErr,
      );
      if (!ok) {
        return;
      }
    }

    yield call(registerAccount, profile, eosService);

    yield call(getCurrentAccountWorker);

    const singleCommunityId = isSingleCommunityWebsite();

    if (singleCommunityId) {
      yield call(followCommunity, eosService, singleCommunityId, accountName);
    }

    yield put(finishRegistrationWithDisplayNameSuccess());
  } catch (err) {
    yield put(finishRegistrationWithDisplayNameErr(err));
  }
}

export function* redirectToFeedWorker() {
  const isLeftMenuVisible = yield select(selectIsMenuVisible());
  const profileInfo = yield select(makeSelectProfileInfo());
  const singleCommunityId = isSingleCommunityWebsite();

  if (isLeftMenuVisible) {
    yield put(hideLeftMenu());
  }

  if (profileInfo && !singleCommunityId) {
    yield call(createdHistory.push, routes.feed());
  } else if (singleCommunityId) {
    yield call(createdHistory.push, routes.questions());
  }
}

export default function*() {
  yield takeLatest(LOGIN_WITH_EMAIL, loginWithEmailWorker);
  yield takeLatest(LOGIN_WITH_SCATTER, loginWithScatterWorker);
  yield takeLatest(FINISH_REGISTRATION, finishRegistrationWorker);
}

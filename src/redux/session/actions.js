// Root //
import { LOGIN, LOGIN_FAILURE, LOGOUT } from './types';
import LocalStorage from '../../utils/localStorage';
import { apiPost } from '../../api/methods';
import { ACCESS_TOKEN } from '../../constants/text';
import { urls } from '../../api/urls';

export const setSession = (user) => {
  LocalStorage.set(ACCESS_TOKEN, user?.token || '');
  LocalStorage.setObject('user', user);

  return {
    type: LOGIN,
    payload: { user }
  };
};

export const failedSession = (errorMessage) => {
  return {
    type: LOGIN_FAILURE,
    payload: errorMessage
  };
};

export const login = ({ email, password, recaptchaToken }) => {
  return async (dispatch) => {
    try {
      const response = await apiPost(urls.login.auth, { email, password }, { Recaptcha: recaptchaToken ?? '' });
      console.log('response', response);
      await dispatch(setSession(response));
      return Promise.resolve();
    } catch (error) {
      dispatch(failedSession('*Ingrese un email y/o contraseña válidos'));
      return Promise.reject(error);
    }
  };
};

export const logout = () => {
  LocalStorage.clearKey('recaptchaToken');
  LocalStorage.clearKey('user');
  LocalStorage.clearKey('accessToken');
  LocalStorage.clearKey('USER_TOKEN');
  return {
    type: LOGOUT
  };
};

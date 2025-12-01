import { store } from '../redux/configureStore';
import { hideLoader, showLoader } from '../redux/loader/actions';
import { ACCESS_TOKEN, USER_DATA } from '../constants/text';
import { FORBIDDEN, UNAUTHORIZED } from '../constants/statusCodes';
import localStorage from '../utils/localStorage';
import { logout } from '../redux/session/actions';

const getStateLoader = () => store.getState().loader.loader;

const TIMEOUT_DURATION = Number(import.meta.env.VITE_APP_API_TIMEOUT) || 5000;

const createInstance = () => {
  return {
    request: async (url, options) => {
      let headers = {
        ...options.headers
      };

      const initialStateLoader = getStateLoader();
      if (!initialStateLoader && options?.body && typeof options?.body === 'string') {
        store.dispatch(showLoader());
      }

      const userToken = localStorage.get(ACCESS_TOKEN);

      if (userToken) {
        headers = {
          'SN-token': userToken,
          ...headers
        };
      }

      const requestOptions = {
        ...options,
        headers
      };

      const controller = new AbortController();
      const { signal } = controller;
      requestOptions.signal = signal;

      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        const loaderStateResponse = getStateLoader();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        if (loaderStateResponse) {
          store.dispatch(hideLoader());
        }

        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error) {
        clearTimeout(timeoutId);

        const loaderStateError = getStateLoader();
        if (loaderStateError) {
          store.dispatch(hideLoader());
        }

        if (error.name === 'AbortError') {
          console.error(`Request timed out after ${TIMEOUT_DURATION} ms`);
        } else if (error?.response && [UNAUTHORIZED, FORBIDDEN].includes(error?.response?.status)) {
          localStorage.clearKey(ACCESS_TOKEN);
          localStorage.clearKey(USER_DATA);
          if (error?.response?.status === UNAUTHORIZED) {
            store.dispatch(logout());
          }
        }

        throw error;
      }
    }
  };
};

const instance = createInstance();

export default instance;

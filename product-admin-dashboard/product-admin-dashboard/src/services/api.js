// The ONE shared Axios instance. Every service file imports this.
// It does two jobs in one place:
//   1) adds the login token to every request
//   2) handles errors (friendly message + automatic logout on 401)

import axios from 'axios';
import { getToken, logout } from '../utils/auth';
import { getErrorMessage } from '../utils/errorMessage';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000, // give up after 15 seconds instead of loading forever
});

// Runs BEFORE every request: attach "Authorization: Bearer <token>" if we have a token.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Runs AFTER every response. Successful responses pass straight through.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A cancelled request is on purpose (for example an old search), not a real error.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Attach a readable message so the UI never has to look inside the raw error.
    error.userMessage = getErrorMessage(error);

    // 401 = the token is not valid any more. Log out and go to the login page.
    // The login request itself can fail with wrong details, so it is skipped.
    const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      logout();
      window.location.assign('/login'); // full reload clears any leftover page state
    }

    return Promise.reject(error);
  }
);

// Pages use this to tell "cancelled on purpose" apart from a real error.
export const isCancel = axios.isCancel;

export default api;

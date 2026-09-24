// Small helpers for the login token. The token lives in localStorage,
// so the user stays logged in after a page refresh.

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null; // saved data was broken, treat it as "no user"
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

// Logging out = forgetting the token and the user.
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

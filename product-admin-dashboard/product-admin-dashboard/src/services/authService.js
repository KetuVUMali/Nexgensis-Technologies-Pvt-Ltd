import api from './api';

// POST /auth/login  ->  { accessToken, id, username, firstName, ... }
// A wrong username or password makes DummyJSON answer 400 "Invalid credentials".
export async function loginUser({ username, password }) {
  const response = await api.post('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });
  return response.data;
}

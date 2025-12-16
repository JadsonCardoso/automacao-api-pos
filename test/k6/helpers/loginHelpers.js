import http from 'k6/http';
import { BASE_URL } from './baseURL.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', () => {
  return JSON.parse(open('../data/login.data.json'));
})

export function loginHelpers() {
  const user = users[(__VU - 1) % users.length];

  const username = user.username;
  const password = user.password;

  let res = http.post(`${BASE_URL}/login`, JSON.stringify({ username, password }), {
    headers: { 'Content-Type': 'application/json' }
  })

  return res;
}

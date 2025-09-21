import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


const config = JSON.parse(open('../data/config.json'));
const BASE_URL = config.baseUrl;


const users = new SharedArray('users', function() {
  return config.users;
});

export const options = {

  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s'
    }
  },
  thresholds: {

    'http_req_duration{endpoint:profile}': ['p(95)<300'],
    'http_req_duration{endpoint:tasks}': ['p(95)<400'],
    'http_req_duration{endpoint:notes}': ['p(95)<400'],
    'http_req_duration{endpoint:activities}': ['p(95)<400']
  }
};


export default function() {

  const user = users[randomIntBetween(0, users.length - 1)];


  const token = login(user);

  if (!token) {
    console.log('Login failed, skipping API tests');
    return;
  }


  const authParams = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  group('API Endpoints Performance', function() {

    const profileParams = { ...authParams };
    profileParams.tags = { endpoint: 'profile' };

    const profileRes = http.get(`${BASE_URL}/users/profile`, profileParams);

    check(profileRes, {
      'profile status is 200': (r) => r.status === 200,
    });

    sleep(randomIntBetween(0.5, 1));


    const tasksParams = { ...authParams };
    tasksParams.tags = { endpoint: 'tasks' };

    const tasksRes = http.get(`${BASE_URL}/tasks`, tasksParams);

    check(tasksRes, {
      'tasks status is 200': (r) => r.status === 200,
    });

    sleep(randomIntBetween(0.5, 1));


    const notesParams = { ...authParams };
    notesParams.tags = { endpoint: 'notes' };

    const notesRes = http.get(`${BASE_URL}/notes`, notesParams);

    check(notesRes, {
      'notes status is 200': (r) => r.status === 200,
    });

    sleep(randomIntBetween(0.5, 1));


    const activitiesParams = { ...authParams };
    activitiesParams.tags = { endpoint: 'activities' };

    const activitiesRes = http.get(`${BASE_URL}/activities`, activitiesParams);

    check(activitiesRes, {
      'activities status is 200': (r) => r.status === 200,
    });
  });


  sleep(randomIntBetween(1, 2));
}


function login(user) {
  const payload = JSON.stringify({
    email: user.email,
    password: user.password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  if (res.status === 200 && res.json('data.tokens.accessToken')) {
    return res.json('data.tokens.accessToken');
  }

  return null;
}
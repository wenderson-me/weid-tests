import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


const config = JSON.parse(open('../data/config.json'));
const BASE_URL = config.baseUrl;

export const options = {
  scenarios: {
    endurance: {
      executor: 'constant-vus',
      vus: 2,
      duration: '10m'
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01']
  }
};

export default function() {
  const email = `endurance_${randomString(8)}@example.com`;
  const password = 'EnduranceTest123!';

  group('User Registration and Authentication Flow', function() {
    const regPayload = JSON.stringify({
      name: `Endurance Test User ${randomString(5)}`,
      email: email,
      password: password,
      confirmPassword: password
    });

    const regParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const regRes = http.post(`${BASE_URL}/auth/register`, regPayload, regParams);

    check(regRes, {
      'registration status is 201': (r) => r.status === 201,
    });

    sleep(1);

    const loginPayload = JSON.stringify({
      email: email,
      password: password
    });

    const loginParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);

    const success = check(loginRes, {
      'login status is 200': (r) => r.status === 200,
      'has access token': (r) => r.json('data.tokens.accessToken') !== undefined,
    });

    if (!success) {
      console.log(`Login failed for ${email}: ${loginRes.status} ${loginRes.body}`);
      return;
    }

    const token = loginRes.json('data.tokens.accessToken');

    const authParams = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const profileRes = http.get(`${BASE_URL}/users/profile`, authParams);

    check(profileRes, {
      'profile status is 200': (r) => r.status === 200,
    });

    sleep(1);

    const taskPayload = JSON.stringify({
      title: `Endurance Test Task ${randomString(5)}`,
      description: 'This task was created during endurance testing',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'medium',
      status: 'todo'
    });

    const createTaskRes = http.post(`${BASE_URL}/tasks`, taskPayload, authParams);

    check(createTaskRes, {
      'create task status is 201': (r) => r.status === 201,
    });


    sleep(1);
  });

}
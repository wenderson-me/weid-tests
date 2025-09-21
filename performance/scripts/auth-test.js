import { sleep, check, group } from 'k6';
import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { Trend, Counter, Rate } from 'k6/metrics';
import { randomIntBetween } from 'https'
import exec from 'k6/execution';

const config = JSON.parse(open('../data/config.json'));
const BASE_URL = config.baseUrl;

const authDuration = new Trend('auth_duration');
const successfulLogins = new Counter('successful_logins');
const failedLogins = new Counter('failed_logins');
const successRate = new Rate('success_rate');

const users = new SharedArray('users', function() {
  return config.users;
});


function generateRandomIP() {
  const octet1 = randomIntBetween(1, 254);
  const octet2 = randomIntBetween(1, 254);
  const octet3 = randomIntBetween(1, 254);
  const octet4 = randomIntBetween(1, 254);
  return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

export const options = {

  scenarios: config.authScenarios || {

    different_ips: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 10,
      maxDuration: '2m'
    }
  },
  thresholds: config.thresholds
};

function login(user, ip) {
  const payload = JSON.stringify({
    email: user.email,
    password: user.password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': ip,
      'X-Real-IP': ip
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  authDuration.add(res.timings.duration);

  const success = check(res, {
    'login status is 200': (r) => r.status === 200,
    'has access token': (r) => r.json('data.tokens.accessToken') !== undefined,
  });

  if (success) {
    successfulLogins.add(1);
    successRate.add(1);
    return res.json('data.tokens.accessToken');
  } else {
    console.log(`Login failed for ${user.email} from IP ${ip}: ${res.status} ${res.body}`);
    failedLogins.add(1);
    successRate.add(0);
    return null;
  }
}

export default function() {

  const user = users[randomIntBetween(0, users.length - 1)];

  const uniqueIP = generateRandomIP();

  group('Login Flow', function() {

    console.log(`VU ${exec.vu.idInTest}, Iteration ${exec.vu.iterationInScenario}, using IP: ${uniqueIP}`);

    const token = login(user, uniqueIP);

    if (token) {
      sleep(1);
      const profileParams = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',

          'X-Forwarded-For': uniqueIP,
          'X-Real-IP': uniqueIP
        },
      };

      const profileRes = http.get(`${BASE_URL}/users/profile`, profileParams);

      check(profileRes, {
        'profile status is 200': (r) => r.status === 200,
        'profile has name': (r) => r.json('data.name') !== undefined,
      });
    }

    sleep(randomIntBetween(1, 3));
  });
}
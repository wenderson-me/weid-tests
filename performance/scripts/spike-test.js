import { check, sleep } from 'k6';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Load configuration
const config = JSON.parse(open('../data/config.json'));
const BASE_URL = config.baseUrl;

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 200,
      stages: [
        { duration: '10s', target: 5 },   // Normal load
        { duration: '20s', target: 50 },  // Spike in traffic
        { duration: '30s', target: 100 }, // Extreme spike
        { duration: '20s', target: 10 },  // Scale back down
        { duration: '10s', target: 0 }    // Cool down
      ]
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.1']
  }
};

export default function() {

  const homeRes = http.get(`${BASE_URL}/health`);

  check(homeRes, {
    'health check status is 200': (r) => r.status === 200,
  });

  sleep(randomIntBetween(0.1, 0.5));

  const regPayload = JSON.stringify({
    name: `Load Test User ${Date.now()}`,
    email: `loadtest_${Date.now()}@example.com`,
    password: 'StrongPassword123!',
    confirmPassword: 'StrongPassword123!'
  });

  const regParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const regRes = http.post(`${BASE_URL}/auth/register`, regPayload, regParams);

  check(regRes, {
    'registration response received': (r) => r.status !== 0,
  });

  sleep(randomIntBetween(0.1, 0.3));
}
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
    tasks_crud: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '30s', target: 10 },
        { duration: '10s', target: 0 }
      ]
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    'http_req_duration{name:create}': ['p(95)<600'],
    'http_req_duration{name:list}': ['p(95)<400'],
    'http_req_duration{name:update}': ['p(95)<600'],
    'http_req_duration{name:delete}': ['p(95)<500']
  }
};

export default function() {
  const user = users[randomIntBetween(0, users.length - 1)];

  const token = login(user);

  if (!token) {
    console.log('Login failed, skipping task tests');
    return;
  }

  const authParams = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    tags: { name: 'list' }
  };

  group('Task CRUD Operations', function() {
    const listRes = http.get(`${BASE_URL}/tasks`, authParams);

    check(listRes, {
      'list tasks status is 200': (r) => r.status === 200,
      'tasks array exists': (r) => Array.isArray(r.json('data')),
    });

    const taskPayload = JSON.stringify({
      title: `Performance Test Task ${Date.now()}`,
      description: 'This task was created during performance testing',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'medium',
      status: 'todo'
    });

    const createParams = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      tags: { name: 'create' }
    };

    const createRes = http.post(`${BASE_URL}/tasks`, taskPayload, createParams);

    check(createRes, {
      'create task status is 201': (r) => r.status === 201,
      'created task has id': (r) => r.json('data.id') !== undefined,
    });

    if (createRes.status === 201) {
      const taskId = createRes.json('data.id');

      sleep(randomIntBetween(1, 2));

      const updatePayload = JSON.stringify({
        status: 'in-progress',
        priority: 'high'
      });

      const updateParams = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        tags: { name: 'update' }
      };

      const updateRes = http.put(`${BASE_URL}/tasks/${taskId}`, updatePayload, updateParams);

      check(updateRes, {
        'update task status is 200': (r) => r.status === 200,
        'task status updated': (r) => r.json('data.status') === 'in-progress',
      });

      sleep(randomIntBetween(1, 2));

      const deleteParams = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        tags: { name: 'delete' }
      };

      const deleteRes = http.del(`${BASE_URL}/tasks/${taskId}`, null, deleteParams);

      check(deleteRes, {
        'delete task status is 200': (r) => r.status === 200,
      });
    }
  });

  sleep(randomIntBetween(1, 3));
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
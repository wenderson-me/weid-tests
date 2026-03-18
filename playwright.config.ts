import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.API_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'auth',
      testMatch: /auth\.spec\.ts/,
    },
    {
      name: 'users',
      testMatch: /users\.spec\.ts/,
      dependencies: ['auth'],
    },
    {
      name: 'tasks',
      testMatch: /tasks\.spec\.ts/,
      dependencies: ['auth'],
    },
    {
      name: 'notes',
      testMatch: /notes\.spec\.ts/,
      dependencies: ['auth'],
    },
  ],
});

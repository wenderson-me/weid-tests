import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  projects: [
    {
      name: 'auth',
      testDir: './tests/api',
      testMatch: /auth\.spec\.ts/,
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'users',
      testDir: './tests/api',
      testMatch: /users\.spec\.ts/,
      dependencies: ['auth'],
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'tasks',
      testDir: './tests/api',
      testMatch: /tasks\.spec\.ts/,
      dependencies: ['auth'],
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'notes',
      testDir: './tests/api',
      testMatch: /notes\.spec\.ts/,
      dependencies: ['auth'],
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
  ],
});

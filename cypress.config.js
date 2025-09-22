const { defineConfig } = require('cypress')
const fs = require('fs');
const path = require('path');

const usersJsonPath = path.resolve(__dirname, 'cypress/fixtures/users.json');
const usersExamplePath = path.resolve(__dirname, 'cypress/fixtures/users.example.json');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--auto-open-devtools-for-tabs');
          return launchOptions;
        }
      });

      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    waitForAnimations: true,
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  env: {
    apiUrl: 'http://localhost:5000/api/v1',
  }
})
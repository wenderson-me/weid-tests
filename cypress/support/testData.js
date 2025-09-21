// This file loads the proper test data based on environment
// It will use the example file if the real data file is not available

const fs = require('fs');
const path = require('path');

/**
 * Gets test users data, either from users.json if it exists
 * or from users.example.json as a fallback
 */
function getTestUsers() {
  const realDataPath = path.resolve(__dirname, '../fixtures/users.json');
  const exampleDataPath = path.resolve(__dirname, '../fixtures/users.example.json');

  if (fs.existsSync(realDataPath)) {
    return require(realDataPath);
  }

  if (fs.existsSync(exampleDataPath)) {
    console.log('Warning: Using example user data. Create users.json for real test data.');
    return require(exampleDataPath);
  }

  console.error('Error: No test user data found. Create fixtures/users.json or users.example.json');
  throw new Error('No test user data found');
}

function getEnvVarOrDefault(key, defaultValue) {
  return process.env[key] || defaultValue;
}

module.exports = {
  getTestUsers,
  getEnvVarOrDefault
};
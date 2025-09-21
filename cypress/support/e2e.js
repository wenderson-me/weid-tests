// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './testData'

Cypress.Commands.add('getTestUsers', () => {
  const testUserEmail = Cypress.env('TEST_USER_EMAIL');
  const testUserPassword = Cypress.env('TEST_USER_PASSWORD');
  const testUserName = Cypress.env('TEST_USER_NAME');

  if (testUserEmail && testUserPassword) {
    return cy.wrap({
      validUser: {
        email: testUserEmail,
        password: testUserPassword,
        name: testUserName || 'Test User'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      newUser: {
        name: 'New Test User',
        email: 'newuser@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234'
      },
      invalidRegistrations: {
        weakPassword: {
          name: 'Weak Password User',
          email: 'weakpass@example.com',
          password: 'weak',
          confirmPassword: 'weak'
        },
        mismatchedPasswords: {
          name: 'Mismatched Passwords',
          email: 'mismatch@example.com',
          password: 'Test@1234',
          confirmPassword: 'Test@5678'
        },
        invalidEmail: {
          name: 'Invalid Email',
          email: 'notanemail',
          password: 'Test@1234',
          confirmPassword: 'Test@1234'
        }
      }
    });
  }

  return cy.fixture('users');
});

// Hide fetch/XHR requests in the command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
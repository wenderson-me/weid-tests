// Custom command for login via UI
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command for login via API
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email,
      password
    }
  }).then(response => {
    expect(response.status).to.eq(200);
    expect(response.body.data).to.have.property('tokens');

    // Store tokens in localStorage
    cy.setLocalStorage('accessToken', response.body.data.tokens.accessToken);
    cy.setLocalStorage('refreshToken', response.body.data.tokens.refreshToken);
    cy.saveLocalStorage();
  });
});

// Custom command for registering a new user via API
Cypress.Commands.add('registerViaAPI', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: userData,
    failOnStatusCode: false
  });
});

// Custom command for checking if an element is visible
Cypress.Commands.add('isVisible', { prevSubject: 'element' }, (element) => {
  cy.wrap(element).should('be.visible');
});

// Custom command for clearing the database before tests
Cypress.Commands.add('clearTestUser', (email) => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/auth/test-users`,
    body: { email },
    failOnStatusCode: false
  }).then(response => {
    return;
  });
});
/// <reference types="cypress" />

describe("Login Functionality", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit("/login");
  });

  it("should display the login form correctly", () => {
    cy.contains("h2", "Welcome back").should("be.visible");
    cy.contains("p", "Please enter your details to sign in").should(
      "be.visible"
    );

    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");

    cy.get('button[type="submit"]').contains("Sign in").should("be.visible");
    cy.contains("a", "Forgot password?").should("be.visible");
    cy.contains("a", "Sign up").should("be.visible");
  });

  it("should show validation errors for empty form submission", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("Please enter your email address").should("be.visible");
    cy.contains("Please enter your password").should("be.visible");

    cy.url().should("include", "/login");
  });

  it("should show validation error for invalid email format", () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('ValidP@ssw0rd');

    cy.get('button[type="submit"]').click();

    cy.contains("Please enter a valid email address").should("be.visible");

    cy.url().should("include", "/login");
  });

  it("should show error message for password without special characters", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("Password123");

    cy.get('button[type="submit"]').click();

    cy.contains("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character").should("be.visible");

    cy.url().should("include", "/login");
  });

  it("should show error message for short password", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("Pw1!");

    cy.get('button[type="submit"]').click();

    cy.contains("Password must be at least 8 characters").should("be.visible");

    cy.url().should("include", "/login");
  });

  it("should toggle password visibility", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get("button.absolute.inset-y-0.right-0").click();

    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get("button.absolute.inset-y-0.right-0").click();

    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  it("should navigate to forgot password page", () => {
    cy.contains("a", "Forgot password?").click();

    cy.url().should("include", "/forgot-password");
  });

  it("should navigate to register page", () => {
    cy.contains("a", "Sign up").click();

    cy.url().should("include", "/register");
  });

  it.only("should successfully login with valid credentials", () => {

    cy.get('input[name="email"]').type(Cypress.env('VALID_USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('VALID_USER_PASSWORD'));

      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/dashboard");

      cy.window().then((window) => {
        expect(window.localStorage.getItem("accessToken")).to.exist;
        expect(window.localStorage.getItem("refreshToken")).to.exist;
      });
  });
});

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

    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");

    cy.url().should("include", "/login");
  });

  it("should show validation error for invalid email format", () => {
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[name="password"]').type("Password123!");

    cy.get('button[type="submit"]').click();

    cy.contains("Invalid email address").should("be.visible");

    cy.url().should("include", "/login");
  });

  it.skip("should show error message for invalid credentials", () => {
    cy.getTestUsers().then((users) => {
      cy.get('input[name="email"]').type(users.invalidUser.email);
      cy.get('input[name="password"]').type(users.invalidUser.password);

      cy.get('button[type="submit"]').click();

      cy.contains("Login failed").should("be.visible");

      cy.url().should("include", "/login");
    });
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

  it("should successfully login with valid credentials", () => {
    cy.getTestUsers().then((users) => {
      cy.intercept("POST", "**/auth/login", {
        statusCode: 200,
        body: {
          data: {
            user: {
              id: "123456",
              name: users.validUser.name,
              email: users.validUser.email,
            },
            tokens: {
              accessToken: "mock-access-token",
              refreshToken: "mock-refresh-token",
            },
          },
          message: "Login successful",
        },
      }).as("loginRequest");

      cy.get('input[name="email"]').type(users.validUser.email);
      cy.get('input[name="password"]').type(users.validUser.password);

      cy.get('button[type="submit"]').click();

      cy.wait("@loginRequest");

      cy.url().should("include", "/dashboard");

      cy.window().then((window) => {
        expect(window.localStorage.getItem("accessToken")).to.eq(
          "mock-access-token"
        );
        expect(window.localStorage.getItem("refreshToken")).to.eq(
          "mock-refresh-token"
        );
      });
    });
  });
});

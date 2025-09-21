describe("User Registration Functionality", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit("/register");
  });

  it("should display the registration form correctly", () => {
    cy.contains("h2", "Create an account").should("exist");
    cy.contains("p", "Please enter your details to sign up").should("exist");

    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="confirmPassword"]').should("be.visible");

    cy.get('button[type="submit"]').contains("Sign up").should("be.visible");
    cy.contains("a", "Sign in").should("be.visible");
  });

  it("should show validation errors for empty form submission", () => {
    cy.get('button[type="submit"]').click();

    cy.contains("Name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("Please confirm your password").should("be.visible");

    cy.url().should("include", "/register");
  });

  it("should validate email format", () => {
    cy.fixture("users").then((users) => {
      cy.get('input[name="name"]').type(
        users.invalidRegistrations.invalidEmail.name
      );
      cy.get('input[name="email"]').type(
        users.invalidRegistrations.invalidEmail.email
      );
      cy.get('input[name="password"]').type(
        users.invalidRegistrations.invalidEmail.password
      );
      cy.get('input[name="confirmPassword"]').type(
        users.invalidRegistrations.invalidEmail.confirmPassword
      );

      cy.get('button[type="submit"]').click();

      cy.contains("Invalid email address").should("be.visible");

      cy.url().should("include", "/register");
    });
  });

  it("should validate password strength", () => {
    cy.fixture("users").then((users) => {
      cy.get('input[name="name"]').type(
        users.invalidRegistrations.weakPassword.name
      );
      cy.get('input[name="email"]').type(
        users.invalidRegistrations.weakPassword.email
      );
      cy.get('input[name="password"]').type(
        users.invalidRegistrations.weakPassword.password
      );
      cy.get('input[name="confirmPassword"]').type(
        users.invalidRegistrations.weakPassword.confirmPassword
      );

      cy.get('button[type="submit"]').click();

      cy.contains("Password must be at least 8 characters").should(
        "be.visible"
      );

      cy.url().should("include", "/register");
    });
  });

  it("should validate password confirmation match", () => {
    cy.fixture("users").then((users) => {
      cy.get('input[name="name"]').type(
        users.invalidRegistrations.mismatchedPasswords.name
      );
      cy.get('input[name="email"]').type(
        users.invalidRegistrations.mismatchedPasswords.email
      );
      cy.get('input[name="password"]').type(
        users.invalidRegistrations.mismatchedPasswords.password
      );
      cy.get('input[name="confirmPassword"]').type(
        users.invalidRegistrations.mismatchedPasswords.confirmPassword
      );

      cy.get('button[type="submit"]').click();

      cy.contains("Passwords must match").should("be.visible");

      cy.url().should("include", "/register");
    });
  });

  it("should toggle password visibility", () => {
    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get("button.absolute.inset-y-0.right-0").first().click();

    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get("button.absolute.inset-y-0.right-0").first().click();

    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  it("should navigate to login page", () => {
    cy.contains("a", "Sign in").click();

    cy.url().should("include", "/login");
  });

  it("should show error message for already registered email", () => {
    cy.fixture("users").then((users) => {
      cy.intercept("POST", "**/auth/register", {
        statusCode: 409,
        body: {
          message: "Email is already in use",
        },
      }).as("registerRequest");

      cy.get('input[name="name"]').type(users.validUser.name);
      cy.get('input[name="email"]').type(users.validUser.email);
      cy.get('input[name="password"]').type(users.validUser.password);
      cy.get('input[name="confirmPassword"]').type(users.validUser.password);

      cy.get('button[type="submit"]').click();

      cy.wait("@registerRequest");

      cy.contains("Email is already in use").should("be.visible");

      cy.url().should("include", "/register");
    });
  });

  it("should successfully register a new user", () => {
    cy.fixture("users").then((users) => {
      cy.intercept("POST", "**/auth/register", {
        statusCode: 201,
        body: {
          data: {
            user: {
              id: "123456",
              name: users.newUser.name,
              email: users.newUser.email,
            },
            tokens: {
              accessToken: "mock-access-token",
              refreshToken: "mock-refresh-token",
            },
          },
          message: "Registration successful",
        },
      }).as("registerRequest");

      cy.get('input[name="name"]').type(users.newUser.name);
      cy.get('input[name="email"]').type(users.newUser.email);
      cy.get('input[name="password"]').type(users.newUser.password);
      cy.get('input[name="confirmPassword"]').type(
        users.newUser.confirmPassword
      );

      cy.get('button[type="submit"]').click();

      cy.wait("@registerRequest");

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

import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.signInButton = page.getByTestId('sign-in-button');
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.heading = page.getByRole('heading', { name: 'Welcome back' });
    this.subtitle = page.getByText('Please enter your details to sign in');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }
}

import { test, expect } from '../../src/e2e/fixtures/e2e.fixture';
import { ENV } from '../../src/config/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('deve exibir a página de login corretamente', async ({ loginPage }) => {
    await loginPage.expectToBeVisible();
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('deve fazer login com credenciais válidas', async ({ loginPage, page }) => {
    await loginPage.login(ENV.USER_EMAIL, ENV.USER_PASSWORD);
    await page.waitForURL('**/dashboard');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page).toHaveTitle('Weid - Management');
  });

  test('deve exibir erro com credenciais inválidas', async ({ loginPage, page }) => {
    await loginPage.login('email-invalido@teste.com', 'SenhaErrada123!');

    await expect(page).toHaveURL(/\/login/);
  });

  test('deve exibir erro com campos vazios', async ({ loginPage, page }) => {
    await loginPage.signInButton.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('deve redirecionar usuário não autenticado para login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
  });
});

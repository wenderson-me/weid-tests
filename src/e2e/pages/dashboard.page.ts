import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly greeting: Locator;
  readonly totalTasks: Locator;
  readonly inProgressTasks: Locator;
  readonly completedTasks: Locator;
  readonly overdueTasks: Locator;
  readonly recentTasksHeading: Locator;
  readonly viewAllLink: Locator;

  // Sidebar
  readonly sidebarDashboard: Locator;
  readonly sidebarNotas: Locator;
  readonly sidebarKanban: Locator;
  readonly sidebarClima: Locator;
  readonly sidebarFinancas: Locator;
  readonly sidebarProfile: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard', exact: true });
    this.greeting = page.getByRole('heading', { name: /Bom dia|Boa tarde|Boa noite/ });
    this.totalTasks = page.getByText('Total de Tarefas');
    this.inProgressTasks = page.getByText('Em Andamento');
    this.completedTasks = page.getByText('Concluídas');
    this.overdueTasks = page.getByText('Atrasadas');
    this.recentTasksHeading = page.getByRole('heading', { name: 'Tarefas Recentes' });
    this.viewAllLink = page.getByRole('link', { name: 'Ver todas' });

    // Sidebar
    this.sidebarDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.sidebarNotas = page.getByRole('link', { name: 'Notas' });
    this.sidebarKanban = page.getByRole('link', { name: 'Kanban' });
    this.sidebarClima = page.getByRole('link', { name: 'Clima' });
    this.sidebarFinancas = page.getByRole('link', { name: 'Finanças' });
    this.sidebarProfile = page.getByRole('link', { name: 'Profile' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.greeting).toBeVisible();
  }

  async expectStatsCardsVisible() {
    await expect(this.totalTasks).toBeVisible();
    await expect(this.inProgressTasks).toBeVisible();
    await expect(this.completedTasks).toBeVisible();
    await expect(this.overdueTasks).toBeVisible();
  }

  async expectSidebarVisible() {
    await expect(this.sidebarDashboard).toBeVisible();
    await expect(this.sidebarNotas).toBeVisible();
    await expect(this.sidebarKanban).toBeVisible();
    await expect(this.sidebarClima).toBeVisible();
    await expect(this.sidebarFinancas).toBeVisible();
    await expect(this.sidebarProfile).toBeVisible();
  }

  async expectRecentTasksVisible() {
    await expect(this.recentTasksHeading).toBeVisible();
    await expect(this.viewAllLink).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

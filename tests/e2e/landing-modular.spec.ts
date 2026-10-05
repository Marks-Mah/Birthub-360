import { test, expect } from '@playwright/test';

test.describe('Landing Page Modular E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve renderizar a HeroSection com a headline oficial e botão de acesso', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dados que Conectam');
    const ctaButton = page.locator('a', { hasText: 'Acessar Plataforma' }).first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/login');
  });

  test('deve navegar corretamente pelas seções de âncora', async ({ page }) => {
    const navBeneficios = page.locator('nav a[href="#beneficios"]');
    if (await navBeneficios.isVisible()) {
      await navBeneficios.click();
      await expect(page.locator('#beneficios')).toBeInViewport();
    }
  });

  test('deve alternar a sanfona de perguntas frequentes (FAQ) de forma acessível', async ({ page }) => {
    const faqItem = page.locator('#faq button').first();
    await expect(faqItem).toBeVisible();
    await faqItem.click();
    await expect(faqItem).toHaveAttribute('aria-expanded', 'true');
  });
});

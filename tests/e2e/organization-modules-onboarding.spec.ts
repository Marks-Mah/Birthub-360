import { test, expect } from '@playwright/test';
import { uniqueTestEmail, E2E_PASSWORD } from './helpers';

test.describe('Onboarding de Módulos da Organização', () => {
  test('O administrador é obrigado a configurar a org no primeiro acesso e o acesso fica restrito', async ({ page }) => {
    const email = uniqueTestEmail('onboarding-modules');
    const name = `E2E Org Onboarding ${email}`;

    // 1. SignUp manual para não acionar o auto-wizard do helpers.ts
    await page.goto('/login?signup=1');
    await page.getByPlaceholder('Seu Nome Completo').fill(name);
    await page.getByLabel('Credencial Institucional').fill(email);
    await page.getByPlaceholder('        ').fill(E2E_PASSWORD); // Senha
    await page.getByRole('button', { name: /^Criar conta$/ }).click();

    // Dependendo do ALLOW_DEV_AUTH_BYPASS, ele pode pedir verificação ou já entrar.
    // O mais comum em dev/CI é já entrar, então vamos focar no caminho de bypass ligado
    // (que é o que acontece no CI).
    const outcome = await Promise.race([
      page.waitForURL('**/setup').then(() => 'setup'),
      page.getByText(/Enviamos um link de confirmação/).waitFor({ state: 'visible' }).then(() => 'verification')
    ]);

    // O teste real requer o bypass ativo ou que completemos a verificação,
    // mas num ambiente de dev/CI, ALLOW_DEV_AUTH_BYPASS é true.
    if (outcome === 'verification') {
      test.skip(true, 'Teste requer ambiente com bypass de verificação de e-mail ativado.');
      return;
    }

    // 2. Garante que estamos na tela do wizard
    await expect(page).toHaveURL(/\/setup/);
    await expect(page.locator('text=Bem-vindo(a) ao Birth Hub 360')).toBeVisible();

    // 3. Escolhe módulos
    // Por padrão CRM Comercial está ativo (graças ao useState default). Vamos clicar nele para desativar.
    const crmCard = page.locator('text=CRM Comercial').locator('..');
    await crmCard.click(); // desativa CRM

    const prospectCard = page.locator('text=Prospecção Inteligente').locator('..');
    await prospectCard.click(); // ativa Prospecção

    // 4. Continua o fluxo
    await page.getByRole('button', { name: /Continuar/ }).click();
    await expect(page.locator('text=Tudo pronto!')).toBeVisible();
    await page.getByRole('button', { name: /Ir para o Dashboard/ }).click();

    // 5. Após setup, deve ir para /app
    await page.waitForURL('**/app');

    // 6. Verifica a Sidebar (garante que CRM não está visível e Prospecção está)
    // Core (Painel Central / COMMAND CENTER) sempre está visível.
    const commandCenter = page.locator('text=COMMAND CENTER');
    await expect(commandCenter).toBeVisible();

    // O CRM Comercial não deve estar visível
    const crmSidebar = page.locator('text=CRM COMERCIAL');
    await expect(crmSidebar).toBeHidden();

    // A Prospecção Inteligente deve estar visível
    const prospectSidebar = page.locator('text=PROSPECÇÃO INTELIGENTE');
    await expect(prospectSidebar).toBeVisible();

    // 7. Se recarregar a página, não pode voltar pro setup
    await page.goto('/app');
    await page.waitForURL('**/app');
    await expect(page).not.toHaveURL(/\/setup/);
  });
});

import { test, expect } from "@playwright/test";

test.describe("Fluxo completo: criar template → emitir → validar", () => {
  test("cria um template, emite um certificado e valida pela página pública", async ({ page }) => {
    // 1. Criar template
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");

    const criarBtn = page.getByRole("button", { name: /criar/i });
    if (await criarBtn.isVisible()) {
      await criarBtn.click();
    }

    const nomeTemplateInput = page.getByLabel(/nome/i).or(page.getByPlaceholder(/nome/i));
    if (await nomeTemplateInput.isVisible()) {
      await nomeTemplateInput.fill("Template E2E");
    }

    const salvarBtn = page.getByRole("button", { name: /salvar|criar/i }).first();
    if (await salvarBtn.isVisible()) {
      await salvarBtn.click();
    }

    await expect(page.getByText("Template E2E")).toBeVisible({ timeout: 10000 });

    // 2. Emitir certificado
    await page.goto("/certificados/novo");
    await page.waitForLoadState("networkidle");

    await page.getByLabel(/nome/i).or(page.getByPlaceholder(/nome/i)).fill("João E2E");
    await page.getByLabel(/cpf/i).or(page.getByPlaceholder(/cpf/i)).fill("529.982.247-25");
    await page.getByLabel(/curso/i).or(page.getByPlaceholder(/curso/i)).fill("Curso E2E");
    await page.getByLabel(/validade/i).or(page.getByPlaceholder(/validade/i)).fill("2028-12-31");

    const emitirBtn = page.getByRole("button", { name: /emitir/i });
    await emitirBtn.click();

    await expect(page).toHaveURL(/\/certificados/, { timeout: 10000 });

    // 3. Copiar código de verificação do primeiro certificado
    const codigoEl = page.locator("text=/[A-Z0-9]{6}/").first();
    const verificationCode = await codigoEl.textContent();

    // 4. Validar na página pública
    await page.goto("/verificar");
    await page.waitForLoadState("networkidle");

    await page.getByLabel(/cpf/i).or(page.getByPlaceholder(/cpf/i)).fill("529.982.247-25");
    if (verificationCode) {
      await page.getByLabel(/código|codigo|verificação|verificacao/i)
        .or(page.getByPlaceholder(/código|codigo|verificação|verificacao/i))
        .fill(verificationCode.trim());
    }

    const validarBtn = page.getByRole("button", { name: /validar|verificar/i });
    await validarBtn.click();

    await expect(page.getByText(/válido|valido|ativo|válid/i)).toBeVisible({ timeout: 10000 });
  });
});

import { test, expect } from "@playwright/test";

const TEMPLATE_NAME = `E2E ${Date.now()}`;
const CPF = "529.982.247-25";

test.describe("Fluxo completo: criar template → emitir → validar", () => {
  test("cria um template, emite um certificado e valida pela página pública", async ({ page }) => {
    // 1. Criar template
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /novo template/i }).click();
    await page.getByPlaceholder(/ex\.:/i).fill(TEMPLATE_NAME);
    await page.getByRole("button", { name: /salvar/i }).click();

    await expect(page.getByText(TEMPLATE_NAME)).toBeVisible({ timeout: 15000 });

    // 2. Emitir certificado
    await page.goto("/certificados/novo");
    await page.waitForLoadState("networkidle");

    await page.selectOption("select", { label: TEMPLATE_NAME });
    await page.locator('div:has(> label:has-text("Nome do participante"))').locator("input").fill("João E2E");
    await page.getByPlaceholder("000.000.000-00").fill(CPF);
    await page.locator('div:has(> label:has-text("Nome do curso"))').locator("input").fill("Curso E2E");
    await page.getByRole("spinbutton").fill("40");
    await page.locator('div:has(> label:has-text("Data de validade"))').locator("input").fill("2028-12-31");

    await page.getByRole("button", { name: /emitir/i }).click();
    await expect(page).toHaveURL(/\/certificados/, { timeout: 15000 });

    // 3. Copiar código de verificação do primeiro certificado
    await page.waitForTimeout(1000);
    const verificationCode = await page.locator(".font-mono.truncate").first().textContent();
    expect(verificationCode).toBeTruthy();

    // 4. Validar na página pública
    await page.goto("/verificar");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("00000000000").fill(CPF);
    if (verificationCode) {
      await page.getByPlaceholder("A3B7K9XZ").fill(verificationCode.trim());
    }

    await page.getByRole("button", { name: /verificar/i }).click();
    await expect(page.getByText(/Certificado autêntico e válido/i)).toBeVisible({ timeout: 15000 });
  });
});

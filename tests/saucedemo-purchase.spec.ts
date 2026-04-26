import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test.describe('SauceDemo - Compra E2E', () => {
  test(
    qase(
      1,
      'Usuario realiza compra completa: login, carrito, checkout, finish',
    ),
    async ({ page }) => {
      await test.step('Navegar a la página de login', async () => {
        await page.goto('/');
        await expect(page).toHaveURL(/saucedemo\.com/);
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
      });

      await test.step('Iniciar sesión con standard_user', async () => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('.inventory_list')).toBeVisible();
      });

      await test.step('Verificar que aparece "Add to cart" en la página principal', async () => {
        const addToCartButtons = page.locator('button:has-text("Add to cart")');
        await expect(addToCartButtons.first()).toBeVisible();
        const count = await addToCartButtons.count();
        expect(count).toBeGreaterThan(0);
      });

      await test.step('Agregar Sauce Labs Backpack al carrito', async () => {
        await page
          .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
          .click();
        await expect(
          page.locator('[data-test="remove-sauce-labs-backpack"]'),
        ).toBeVisible();
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
      });

      await test.step('Ir al carrito', async () => {
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(page.locator('.inventory_item_name')).toHaveText(
          'Sauce Labs Backpack',
        );
      });

      await test.step('Click en Checkout', async () => {
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
        await expect(page.locator('[data-test="firstName"]')).toBeVisible();
      });

      await test.step('Ingresar datos de envío y continuar', async () => {
        await page.locator('[data-test="firstName"]').fill('Alejandro');
        await page.locator('[data-test="lastName"]').fill('Vallejo');
        await page.locator('[data-test="postalCode"]').fill('64000');
        await page.locator('[data-test="continue"]').click();
        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(page.locator('.summary_info')).toBeVisible();
      });

      await test.step('Finalizar compra', async () => {
        await page.locator('[data-test="finish"]').click();
        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(page.locator('.complete-header')).toHaveText(
          'Thank you for your order!',
        );
        await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
      });
    },
  );
});

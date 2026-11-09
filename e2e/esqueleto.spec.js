import { test, expect } from '@playwright/test';

test('la página muestra el título y un tablero vacío de 42 casillas', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Cuatro en raya' })).toBeVisible();

  const casillas = page.getByTestId('tablero').locator('[data-testid^="casilla-"]');
  await expect(casillas).toHaveCount(42);
  for (const casilla of await casillas.all()) {
    await expect(casilla).toBeEmpty();
  }

  await expect(page.getByTestId('casilla-0-0')).toBeVisible();
  await expect(page.getByTestId('casilla-5-6')).toBeVisible();
  await expect(page.locator('[data-testid^="columna-"]')).toHaveCount(7);
});

test('la carga de la página no produce errores en la consola', async ({ page }) => {
  const errores = [];
  page.on('console', (mensaje) => {
    if (mensaje.type() === 'error') errores.push(mensaje.text());
  });
  page.on('pageerror', (error) => errores.push(error.message));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(errores).toEqual([]);
});

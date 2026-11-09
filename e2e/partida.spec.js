import { test, expect } from '@playwright/test';
import { SECUENCIA_EMPATE } from '../src/empate.datos.js';

async function jugarColumnas(page, columnas) {
  for (const columna of columnas) await page.getByTestId(`columna-${columna}`).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('victoria vertical: gana rojo, se resaltan 4 fichas y el tablero queda bloqueado', async ({ page }) => {
  await jugarColumnas(page, [0, 1, 0, 1, 0, 1, 0]);

  await expect(page.getByTestId('estado')).toHaveText('Gana rojo');
  const ganadoras = page.locator('[data-ganadora]');
  await expect(ganadoras).toHaveCount(4);
  for (let fila = 0; fila < 4; fila++) {
    await expect(page.getByTestId(`casilla-${fila}-0`)).toHaveAttribute('data-ganadora');
  }

  // Los botones están desactivados (aria-disabled): se fuerza el clic para
  // comprobar que llega y se ignora.
  await expect(page.getByTestId('columna-3')).toBeDisabled();
  await page.getByTestId('columna-3').click({ force: true });
  await page.getByTestId('casilla-5-4').click();
  await expect(page.locator('[data-color]')).toHaveCount(7);
  await expect(page.getByTestId('estado')).toHaveText('Gana rojo');
});

test('«Nueva partida» deja el tablero vacío y el turno en rojo', async ({ page }) => {
  await jugarColumnas(page, [0, 1, 0, 1, 0, 1, 0]);
  await expect(page.getByTestId('estado')).toHaveText('Gana rojo');

  await page.getByTestId('nueva-partida').click();

  await expect(page.locator('[data-color]')).toHaveCount(0);
  await expect(page.locator('[data-ganadora]')).toHaveCount(0);
  await expect(page.getByTestId('estado')).toHaveText('Turno: rojo');

  await page.getByTestId('columna-2').click();
  await expect(page.getByTestId('casilla-0-2')).toHaveAttribute('data-color', 'rojo');
});

test('la secuencia de empate muestra «Empate»', async ({ page }) => {
  await jugarColumnas(page, SECUENCIA_EMPATE);

  await expect(page.getByTestId('estado')).toHaveText('Empate');
  await expect(page.locator('[data-color]')).toHaveCount(42);
  await expect(page.locator('[data-ganadora]')).toHaveCount(0);
});

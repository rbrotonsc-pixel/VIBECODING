import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('empieza rojo y el texto indica el turno', async ({ page }) => {
  await expect(page.getByTestId('estado')).toHaveText('Turno: rojo');
});

test('dos jugadas en la columna 1: roja abajo, amarilla encima y vuelve a rojo', async ({ page }) => {
  await page.getByTestId('columna-0').click();
  await expect(page.getByTestId('estado')).toHaveText('Turno: amarillo');
  await page.getByTestId('columna-0').click();

  await expect(page.getByTestId('casilla-0-0')).toHaveAttribute('data-color', 'rojo');
  await expect(page.getByTestId('casilla-1-0')).toHaveAttribute('data-color', 'amarillo');
  await expect(page.getByTestId('casilla-2-0')).not.toHaveAttribute('data-color');
  await expect(page.getByTestId('estado')).toHaveText('Turno: rojo');
});

test('pulsar una casilla juega en su columna', async ({ page }) => {
  await page.getByTestId('casilla-5-3').click();
  await expect(page.getByTestId('casilla-0-3')).toHaveAttribute('data-color', 'rojo');
  await expect(page.getByTestId('casilla-5-3')).not.toHaveAttribute('data-color');
});

test('una columna llena no admite más fichas ni cambia el turno', async ({ page }) => {
  const columna = page.getByTestId('columna-2');
  for (let i = 0; i < 6; i++) await columna.click();
  await expect(page.getByTestId('casilla-5-2')).toHaveAttribute('data-color', 'amarillo');
  await expect(page.getByTestId('estado')).toHaveText('Turno: rojo');

  await columna.click();

  await expect(page.getByTestId('estado')).toHaveText('Turno: rojo');
  await expect(page.locator('[data-color]')).toHaveCount(6);
});

test('se puede jugar con el teclado', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('columna-0')).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByTestId('casilla-0-0')).toHaveAttribute('data-color', 'rojo');
  await expect(page.getByTestId('estado')).toHaveText('Turno: amarillo');
});

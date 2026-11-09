// Dato de prueba: 42 jugadas (índices de columna) que terminan en empate.
// Lo usan las pruebas de Vitest y de Playwright.
//
// Comprobado a mano: las columnas 1, 2, 3, 5, 6 y 7 quedan, de abajo arriba,
// R A R A R A y la columna 4 al revés (A R A R A R). Cada fila alterna de
// color en cada grupo y la columna 4 rompe cualquier horizontal de 4; las
// verticales alternan; y en cualquier diagonal la fila cambia de paridad en
// cada paso, así que tampoco hay 4 iguales. Ninguna jugada intermedia gana.
export const SECUENCIA_EMPATE = [
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2,
  4,
  3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4,
  5, 5, 5, 5, 5, 5,
  6, 6, 6, 6, 6, 6,
];

// Elección de jugada del ordenador. Lógica pura: no toca la interfaz.
//
// 1. Si puede ganar en esta jugada, gana.
// 2. Si no, bloquea la victoria inmediata del rival.
// 3. Si no, la columna libre más central.
//
// Límite conocido: si el rival tiene dos jugadas ganadoras, solo bloquea una.

import { columnaLlena, buscarGanador, calcularResultado, soltarFicha, siguienteTurno } from './juego.js';

// Columnas 4, 3, 5, 2, 6, 1, 7: más central primero y, a igual distancia, la de la izquierda.
export const ORDEN_PREFERENCIA = [3, 2, 4, 1, 5, 0, 6];

function columnasLibres(tablero) {
  return ORDEN_PREFERENCIA.filter((columna) => !columnaLlena(tablero, columna));
}

function columnaGanadora(tablero, color, libres) {
  return libres.find((columna) => buscarGanador(soltarFicha(tablero, columna, color))?.color === color);
}

// Devuelve el índice de columna, o null si no hay jugada posible.
export function elegirColumna(tablero, color) {
  if (calcularResultado(tablero)) return null;
  const libres = columnasLibres(tablero);
  return (
    columnaGanadora(tablero, color, libres) ??
    columnaGanadora(tablero, siguienteTurno(color), libres) ??
    libres[0] ??
    null
  );
}

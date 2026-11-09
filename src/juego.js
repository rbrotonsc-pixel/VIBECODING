// Lógica del cuatro en raya, sin nada de interfaz.
// El tablero es tablero[fila][columna]; la fila 0 es la de abajo.

export const FILAS = 6;
export const COLUMNAS = 7;
export const ROJO = 'rojo';
export const AMARILLO = 'amarillo';
export const VACIA = null;

export function crearTablero(inicial) {
  if (inicial) return inicial.map((fila) => [...fila]);
  return Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(VACIA));
}

export function crearPartida({ tablero, turno = ROJO } = {}) {
  return { tablero: crearTablero(tablero), turno };
}

export function columnaValida(columna) {
  return Number.isInteger(columna) && columna >= 0 && columna < COLUMNAS;
}

export function columnaLlena(tablero, columna) {
  return tablero[FILAS - 1][columna] !== VACIA;
}

export function siguienteTurno(turno) {
  return turno === ROJO ? AMARILLO : ROJO;
}

// Devuelve una partida nueva con la ficha puesta y el turno cambiado.
// Si la jugada no es válida, devuelve la misma partida sin tocarla.
export function jugar(partida, columna) {
  if (!columnaValida(columna) || columnaLlena(partida.tablero, columna)) {
    return partida;
  }
  const tablero = crearTablero(partida.tablero);
  const fila = tablero.findIndex((f) => f[columna] === VACIA);
  tablero[fila][columna] = partida.turno;
  return { tablero, turno: siguienteTurno(partida.turno) };
}

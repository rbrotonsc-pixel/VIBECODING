// Lógica del cuatro en raya, sin nada de interfaz.
// El tablero es tablero[fila][columna]; la fila 0 es la de abajo.

export const FILAS = 6;
export const COLUMNAS = 7;
export const ROJO = 'rojo';
export const AMARILLO = 'amarillo';
export const VACIA = null;

// Direcciones en las que se busca un 4 en raya: [fila, columna].
const DIRECCIONES = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // diagonal ↗
  [1, -1], // diagonal ↖ (equivale a ↘)
];

export function crearTablero(inicial) {
  if (inicial) return inicial.map((fila) => [...fila]);
  return Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(VACIA));
}

export function crearPartida({ tablero, turno = ROJO } = {}) {
  const copia = crearTablero(tablero);
  return { tablero: copia, turno, resultado: calcularResultado(copia) };
}

export function columnaValida(columna) {
  return Number.isInteger(columna) && columna >= 0 && columna < COLUMNAS;
}

export function columnaLlena(tablero, columna) {
  return tablero[FILAS - 1][columna] !== VACIA;
}

export function tableroLleno(tablero) {
  return tablero[FILAS - 1].every((casilla) => casilla !== VACIA);
}

export function siguienteTurno(turno) {
  return turno === ROJO ? AMARILLO : ROJO;
}

// Devuelve un tablero nuevo con la ficha de `color` en `columna`,
// o null si la columna no es válida o está llena.
export function soltarFicha(tablero, columna, color) {
  if (!columnaValida(columna) || columnaLlena(tablero, columna)) return null;
  const nuevo = crearTablero(tablero);
  const fila = nuevo.findIndex((f) => f[columna] === VACIA);
  nuevo[fila][columna] = color;
  return nuevo;
}

function dentro(fila, columna) {
  return fila >= 0 && fila < FILAS && columna >= 0 && columna < COLUMNAS;
}

// Busca 4 fichas seguidas del mismo color.
// Devuelve { color, casillas: [[fila, columna] × 4] } o null.
export function buscarGanador(tablero) {
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const color = tablero[fila][columna];
      if (color === VACIA) continue;
      for (const [df, dc] of DIRECCIONES) {
        const casillas = [0, 1, 2, 3].map((i) => [fila + df * i, columna + dc * i]);
        const completa = casillas.every(([f, c]) => dentro(f, c) && tablero[f][c] === color);
        if (completa) return { color, casillas };
      }
    }
  }
  return null;
}

// La victoria se comprueba antes que el empate.
export function calcularResultado(tablero) {
  const ganador = buscarGanador(tablero);
  if (ganador) return { tipo: 'victoria', ...ganador };
  if (tableroLleno(tablero)) return { tipo: 'empate' };
  return null;
}

// Devuelve una partida nueva con la ficha puesta y el turno cambiado.
// Si la jugada no es válida o la partida ha terminado, devuelve la misma partida.
export function jugar(partida, columna) {
  if (partida.resultado) return partida;
  const tablero = soltarFicha(partida.tablero, columna, partida.turno);
  if (!tablero) return partida;
  return { tablero, turno: siguienteTurno(partida.turno), resultado: calcularResultado(tablero) };
}

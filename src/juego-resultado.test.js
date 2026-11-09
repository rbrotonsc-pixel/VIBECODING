import { describe, it, expect } from 'vitest';
import {
  ROJO,
  AMARILLO,
  VACIA,
  crearTablero,
  crearPartida,
  buscarGanador,
  calcularResultado,
  tableroLleno,
  jugar,
} from './juego.js';
import { SECUENCIA_EMPATE } from './empate.datos.js';

const R = ROJO;
const A = AMARILLO;

// Monta un tablero a partir de filas escritas de arriba abajo, como se ve en pantalla.
// '.' vacía, 'R' roja, 'A' amarilla.
function tableroDesde(dibujo) {
  const filas = dibujo.trim().split('\n').map((l) => l.trim()).reverse();
  const tablero = crearTablero();
  filas.forEach((linea, fila) => {
    [...linea].forEach((letra, columna) => {
      tablero[fila][columna] = { R, A }[letra] ?? VACIA;
    });
  });
  return tablero;
}

function jugarVarias(partida, columnas) {
  return columnas.reduce((p, c) => jugar(p, c), partida);
}

function ordenar(casillas) {
  return [...casillas].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('buscarGanador', () => {
  it('no hay ganador en un tablero vacío', () => {
    expect(buscarGanador(crearTablero())).toBeNull();
  });

  it.each([
    ['horizontal pegada a la izquierda', 'R', [[0, 0], [0, 1], [0, 2], [0, 3]]],
    ['horizontal pegada a la derecha arriba', 'A', [[5, 3], [5, 4], [5, 5], [5, 6]]],
    ['vertical en la columna 1 desde abajo', 'R', [[0, 0], [1, 0], [2, 0], [3, 0]]],
    ['vertical en la columna 7 hasta arriba', 'A', [[2, 6], [3, 6], [4, 6], [5, 6]]],
    ['diagonal ↗ desde la esquina inferior izquierda', 'R', [[0, 0], [1, 1], [2, 2], [3, 3]]],
    ['diagonal ↗ hasta la esquina superior derecha', 'A', [[2, 3], [3, 4], [4, 5], [5, 6]]],
    ['diagonal ↘ desde la esquina superior izquierda', 'R', [[5, 0], [4, 1], [3, 2], [2, 3]]],
    ['diagonal ↘ hasta la esquina inferior derecha', 'A', [[3, 3], [2, 4], [1, 5], [0, 6]]],
  ])('detecta %s', (_nombre, letra, casillas) => {
    const tablero = crearTablero();
    const color = { R, A }[letra];
    for (const [f, c] of casillas) tablero[f][c] = color;

    const ganador = buscarGanador(tablero);

    expect(ganador.color).toBe(color);
    expect(ordenar(ganador.casillas)).toEqual(ordenar(casillas));
  });

  it('3 en raya no gana', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      R......
      RA.....
      RAAA...
    `);
    expect(buscarGanador(tablero)).toBeNull();
  });

  it('5 en línea gana y devuelve 4 casillas de esa línea', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      .......
      AA.A...
      RRRRR..
    `);
    const ganador = buscarGanador(tablero);
    expect(ganador.color).toBe(ROJO);
    expect(ganador.casillas).toHaveLength(4);
    for (const [f, c] of ganador.casillas) {
      expect(f).toBe(0);
      expect(tablero[f][c]).toBe(ROJO);
    }
  });

  it('no une fichas que se salen por un borde y entran por el otro', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      .......
      .......
      RR...RR
    `);
    expect(buscarGanador(tablero)).toBeNull();
  });
});

describe('resultado de la partida', () => {
  it('una partida nueva no ha terminado', () => {
    expect(crearPartida().resultado).toBeNull();
  });

  it('victoria vertical de rojo jugando por turnos', () => {
    const partida = jugarVarias(crearPartida(), [0, 1, 0, 1, 0, 1, 0]);
    expect(partida.resultado.tipo).toBe('victoria');
    expect(partida.resultado.color).toBe(ROJO);
    expect(ordenar(partida.resultado.casillas)).toEqual([[0, 0], [1, 0], [2, 0], [3, 0]]);
  });

  it('la secuencia guardada de 42 jugadas acaba en empate', () => {
    expect(SECUENCIA_EMPATE).toHaveLength(42);
    let partida = crearPartida();
    for (const columna of SECUENCIA_EMPATE) {
      expect(partida.resultado).toBeNull();
      const siguiente = jugar(partida, columna);
      expect(siguiente).not.toBe(partida);
      partida = siguiente;
    }
    expect(tableroLleno(partida.tablero)).toBe(true);
    expect(partida.resultado).toEqual({ tipo: 'empate' });
  });

  it('si la jugada 42 completa un 4 en raya, es victoria y no empate', () => {
    // Secuencia obtenida con la propia lógica: ninguna de las 41 primeras jugadas
    // termina la partida y la 42 (amarillo) llena el tablero y hace 4 en raya.
    const secuencia = [
      0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 3, 3,
      3, 3, 3, 3, 4, 4, 4, 5, 4, 6, 5, 5, 5, 6, 6, 4, 6, 5, 6, 5, 6,
    ];
    const antes = jugarVarias(crearPartida(), secuencia.slice(0, 41));
    expect(antes.resultado).toBeNull();

    const partida = jugar(antes, secuencia[41]);

    expect(tableroLleno(partida.tablero)).toBe(true);
    expect(partida.resultado.tipo).toBe('victoria');
    expect(partida.resultado.color).toBe(AMARILLO);
    expect(calcularResultado(partida.tablero).tipo).toBe('victoria');
  });

  it('tras una victoria rechaza nuevas jugadas', () => {
    const ganada = jugarVarias(crearPartida(), [0, 1, 0, 1, 0, 1, 0]);
    expect(jugar(ganada, 3)).toBe(ganada);
  });

  it('tras un empate rechaza nuevas jugadas', () => {
    const empatada = jugarVarias(crearPartida(), SECUENCIA_EMPATE);
    expect(jugar(empatada, 0)).toBe(empatada);
  });
});

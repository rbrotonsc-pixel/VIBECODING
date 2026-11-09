import { describe, it, expect } from 'vitest';
import { ROJO, AMARILLO, VACIA, FILAS, crearTablero, crearPartida, jugar, soltarFicha, buscarGanador } from './juego.js';
import { elegirColumna } from './ordenador.js';
import { SECUENCIA_EMPATE } from './empate.datos.js';

const R = ROJO;
const A = AMARILLO;

// Filas escritas de arriba abajo, como se ve en pantalla. '.' vacía, 'R' roja, 'A' amarilla.
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

function llenarColumna(tablero, columna) {
  for (let fila = 0; fila < FILAS; fila++) tablero[fila][columna] = fila % 2 ? A : R;
}

describe('elegirColumna: columna central', () => {
  it('con el tablero vacío elige la columna 4 (índice 3)', () => {
    expect(elegirColumna(crearTablero(), AMARILLO)).toBe(3);
  });

  it('con la columna 4 llena elige la 3', () => {
    const tablero = crearTablero();
    llenarColumna(tablero, 3);
    expect(elegirColumna(tablero, AMARILLO)).toBe(2);
  });

  it('con la 4 y la 3 llenas elige la 5', () => {
    const tablero = crearTablero();
    llenarColumna(tablero, 3);
    llenarColumna(tablero, 2);
    expect(elegirColumna(tablero, AMARILLO)).toBe(4);
  });
});

describe('elegirColumna: ganar', () => {
  // En todos los casos la columna ganadora no es la central, para que no acierte por casualidad.
  it.each([
    ['horizontal', `
      .......
      .......
      .......
      .......
      .......
      RAAA.R.
    `, 4],
    ['vertical', `
      .......
      .......
      .......
      A......
      A.....R
      A....RR
    `, 0],
    ['diagonal ↗', `
      .......
      .......
      .......
      .....AR
      ....ARA
      ...ARAR
    `, 6],
    ['diagonal ↘', `
      .......
      ..A....
      ..RA...
      ..ARA..
      ..RRA..
      ..RARR.
    `, 5],
  ])('completa su 4 en raya en %s', (_nombre, dibujo, esperada) => {
    const tablero = tableroDesde(dibujo);
    expect(buscarGanador(tablero)).toBeNull();
    const columna = elegirColumna(tablero, AMARILLO);
    expect(columna).toBe(esperada);
    expect(buscarGanador(soltarFicha(tablero, columna, AMARILLO))?.color).toBe(AMARILLO);
  });
});

describe('elegirColumna: bloquear', () => {
  it('bloquea el 4 en raya horizontal inmediato del rival', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      .......
      .......
      ARRR...
    `);
    expect(elegirColumna(tablero, AMARILLO)).toBe(4);
  });

  it('bloquea el 4 en raya vertical inmediato del rival', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      ......R
      A.....R
      A.....R
    `);
    expect(elegirColumna(tablero, AMARILLO)).toBe(6);
  });

  it('si puede ganar y el rival también amenaza, prefiere ganar', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      A.....R
      A.....R
      A.....R
    `);
    expect(elegirColumna(tablero, AMARILLO)).toBe(0);
  });

  it('con dos amenazas del rival bloquea una (límite conocido) y pierde', () => {
    const tablero = tableroDesde(`
      .......
      .......
      .......
      .......
      .....A.
      .RRR.AA
    `);
    const columna = elegirColumna(tablero, AMARILLO);
    expect([0, 4]).toContain(columna);
    const libre = columna === 0 ? 4 : 0;
    const despues = soltarFicha(soltarFicha(tablero, columna, AMARILLO), libre, ROJO);
    expect(buscarGanador(despues)?.color).toBe(ROJO);
  });
});

describe('elegirColumna: columnas llenas y partida terminada', () => {
  it('con una sola columna libre elige esa', () => {
    const casiLleno = SECUENCIA_EMPATE.slice(0, -1).reduce((p, c) => jugar(p, c), crearPartida());
    expect(elegirColumna(casiLleno.tablero, AMARILLO)).toBe(6);
  });

  it('nunca elige una columna llena a lo largo de una partida entera', () => {
    let partida = crearPartida();
    while (!partida.resultado) {
      const columna = elegirColumna(partida.tablero, partida.turno);
      expect(partida.tablero[FILAS - 1][columna]).toBe(VACIA);
      partida = jugar(partida, columna);
    }
  });

  it('con el tablero lleno no devuelve jugada', () => {
    const lleno = SECUENCIA_EMPATE.reduce((p, c) => jugar(p, c), crearPartida());
    expect(elegirColumna(lleno.tablero, ROJO)).toBeNull();
  });

  it('con la partida ganada no devuelve jugada', () => {
    const ganada = [0, 1, 0, 1, 0, 1, 0].reduce((p, c) => jugar(p, c), crearPartida());
    expect(elegirColumna(ganada.tablero, AMARILLO)).toBeNull();
  });
});

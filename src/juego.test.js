import { describe, it, expect } from 'vitest';
import {
  FILAS,
  COLUMNAS,
  ROJO,
  AMARILLO,
  VACIA,
  crearTablero,
  crearPartida,
  columnaLlena,
  jugar,
} from './juego.js';

function jugarVarias(partida, columnas) {
  return columnas.reduce((p, c) => jugar(p, c), partida);
}

describe('crearTablero', () => {
  it('crea un tablero vacío de 6 filas por 7 columnas', () => {
    const tablero = crearTablero();
    expect(tablero).toHaveLength(FILAS);
    for (const fila of tablero) {
      expect(fila).toHaveLength(COLUMNAS);
      expect(fila.every((c) => c === VACIA)).toBe(true);
    }
  });

  it('copia un tablero inicial sin compartirlo', () => {
    const inicial = crearTablero();
    inicial[0][3] = ROJO;
    const copia = crearTablero(inicial);
    expect(copia[0][3]).toBe(ROJO);
    copia[0][3] = AMARILLO;
    expect(inicial[0][3]).toBe(ROJO);
  });
});

describe('crearPartida', () => {
  it('empieza con el tablero vacío y turno de rojo', () => {
    const partida = crearPartida();
    expect(partida.turno).toBe(ROJO);
    expect(partida.tablero).toEqual(crearTablero());
  });
});

describe('jugar', () => {
  it('la ficha cae a la fila de abajo', () => {
    const partida = jugar(crearPartida(), 2);
    expect(partida.tablero[0][2]).toBe(ROJO);
    expect(partida.tablero[1][2]).toBe(VACIA);
  });

  it('las fichas se apilan en la misma columna', () => {
    const partida = jugarVarias(crearPartida(), [4, 4, 4]);
    expect(partida.tablero[0][4]).toBe(ROJO);
    expect(partida.tablero[1][4]).toBe(AMARILLO);
    expect(partida.tablero[2][4]).toBe(ROJO);
    expect(partida.tablero[3][4]).toBe(VACIA);
  });

  it('los turnos alternan entre rojo y amarillo', () => {
    let partida = crearPartida();
    partida = jugar(partida, 0);
    expect(partida.turno).toBe(AMARILLO);
    partida = jugar(partida, 1);
    expect(partida.turno).toBe(ROJO);
  });

  it('no modifica la partida original', () => {
    const original = crearPartida();
    jugar(original, 0);
    expect(original.tablero[0][0]).toBe(VACIA);
    expect(original.turno).toBe(ROJO);
  });

  it('una columna llena rechaza la jugada sin cambiar tablero ni turno', () => {
    const llena = jugarVarias(crearPartida(), [0, 0, 0, 0, 0, 0]);
    expect(columnaLlena(llena.tablero, 0)).toBe(true);
    const despues = jugar(llena, 0);
    expect(despues).toBe(llena);
    expect(despues.turno).toBe(ROJO);
  });

  it.each([-1, 7, 1.5, '3', undefined])('rechaza la columna fuera de rango %s', (columna) => {
    const partida = crearPartida();
    expect(jugar(partida, columna)).toBe(partida);
  });

  it('juega sobre un tablero inicial dado', () => {
    const inicial = crearTablero();
    inicial[0][6] = AMARILLO;
    const partida = jugar(crearPartida({ tablero: inicial }), 6);
    expect(partida.tablero[1][6]).toBe(ROJO);
  });
});

describe('columnaLlena', () => {
  it('es falso con menos de 6 fichas y verdadero con 6', () => {
    const cinco = jugarVarias(crearPartida(), [3, 3, 3, 3, 3]);
    expect(columnaLlena(cinco.tablero, 3)).toBe(false);
    expect(columnaLlena(jugar(cinco, 3).tablero, 3)).toBe(true);
  });
});

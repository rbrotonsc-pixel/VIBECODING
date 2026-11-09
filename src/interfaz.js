// Interfaz: dibuja la partida en la página y traduce los clics en jugadas.
// No contiene reglas del juego; todo eso vive en juego.js.

import { FILAS, COLUMNAS, crearPartida, jugar } from './juego.js';

function crearBotonesColumna(contenedor) {
  for (let columna = 0; columna < COLUMNAS; columna++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = '↓';
    boton.dataset.testid = `columna-${columna}`;
    boton.dataset.columna = columna;
    boton.setAttribute('aria-label', `Jugar en la columna ${columna + 1}`);
    contenedor.append(boton);
  }
}

// La fila 0 es la de abajo, así que se crean de la 5 a la 0.
function crearCasillas(contenedor) {
  for (let fila = FILAS - 1; fila >= 0; fila--) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const casilla = document.createElement('div');
      casilla.className = 'casilla';
      casilla.dataset.testid = `casilla-${fila}-${columna}`;
      casilla.dataset.columna = columna;
      casilla.setAttribute('role', 'gridcell');
      contenedor.append(casilla);
    }
  }
}

function dibujar(partida, tablero, estado) {
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const casilla = tablero.querySelector(`[data-testid="casilla-${fila}-${columna}"]`);
      const color = partida.tablero[fila][columna];
      if (color) casilla.dataset.color = color;
      else delete casilla.dataset.color;
      casilla.setAttribute('aria-label', `Fila ${fila + 1}, columna ${columna + 1}: ${color ?? 'vacía'}`);
    }
  }
  estado.textContent = `Turno: ${partida.turno}`;
  estado.dataset.turno = partida.turno;
}

export function iniciarInterfaz(raiz) {
  const columnas = raiz.querySelector('[data-testid="columnas"]');
  const tablero = raiz.querySelector('[data-testid="tablero"]');
  const estado = raiz.querySelector('[data-testid="estado"]');
  let partida = crearPartida();

  crearBotonesColumna(columnas);
  crearCasillas(tablero);

  function alPulsar(evento) {
    const objetivo = evento.target.closest('[data-columna]');
    if (!objetivo) return;
    partida = jugar(partida, Number(objetivo.dataset.columna));
    dibujar(partida, tablero, estado);
  }

  columnas.addEventListener('click', alPulsar);
  tablero.addEventListener('click', alPulsar);
  dibujar(partida, tablero, estado);
}

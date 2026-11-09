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

function textoEstado(partida) {
  const { resultado } = partida;
  if (resultado?.tipo === 'victoria') return `Gana ${resultado.color}`;
  if (resultado?.tipo === 'empate') return 'Empate';
  return `Turno: ${partida.turno}`;
}

function esGanadora(resultado, fila, columna) {
  if (resultado?.tipo !== 'victoria') return false;
  return resultado.casillas.some(([f, c]) => f === fila && c === columna);
}

function dibujarCasillas(partida, tablero) {
  for (let fila = 0; fila < FILAS; fila++) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const casilla = tablero.querySelector(`[data-testid="casilla-${fila}-${columna}"]`);
      const color = partida.tablero[fila][columna];
      if (color) casilla.dataset.color = color;
      else delete casilla.dataset.color;
      casilla.toggleAttribute('data-ganadora', esGanadora(partida.resultado, fila, columna));
      casilla.setAttribute('aria-label', `Fila ${fila + 1}, columna ${columna + 1}: ${color ?? 'vacía'}`);
    }
  }
}

// `bloqueado`: el tablero no admite jugadas (partida terminada u ordenador pensando).
function dibujar(elementos, partida, { bloqueado, texto }) {
  const { tablero, columnas, estado } = elementos;
  dibujarCasillas(partida, tablero);
  tablero.toggleAttribute('data-bloqueado', bloqueado);
  for (const boton of columnas.querySelectorAll('button')) {
    boton.setAttribute('aria-disabled', String(bloqueado));
  }
  estado.textContent = texto ?? textoEstado(partida);
  estado.dataset.turno = partida.resultado?.color ?? partida.turno;
  if (partida.resultado?.tipo === 'empate') delete estado.dataset.turno;
}

export function iniciarInterfaz(raiz) {
  const elementos = {
    columnas: raiz.querySelector('[data-testid="columnas"]'),
    tablero: raiz.querySelector('[data-testid="tablero"]'),
    estado: raiz.querySelector('[data-testid="estado"]'),
    nuevaPartida: raiz.querySelector('[data-testid="nueva-partida"]'),
  };
  let partida = crearPartida();

  crearBotonesColumna(elementos.columnas);
  crearCasillas(elementos.tablero);

  const redibujar = () => dibujar(elementos, partida, { bloqueado: Boolean(partida.resultado) });

  function alPulsar(evento) {
    const objetivo = evento.target.closest('[data-columna]');
    if (!objetivo || partida.resultado) return;
    partida = jugar(partida, Number(objetivo.dataset.columna));
    redibujar();
  }

  function empezarDeNuevo() {
    partida = crearPartida();
    redibujar();
  }

  elementos.columnas.addEventListener('click', alPulsar);
  elementos.tablero.addEventListener('click', alPulsar);
  elementos.nuevaPartida.addEventListener('click', empezarDeNuevo);
  redibujar();
}

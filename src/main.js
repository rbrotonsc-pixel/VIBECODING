const FILAS = 6;
const COLUMNAS = 7;

function dibujarBotonesColumna(contenedor) {
  for (let columna = 0; columna < COLUMNAS; columna++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = '↓';
    boton.dataset.testid = `columna-${columna}`;
    boton.setAttribute('aria-label', `Columna ${columna + 1}`);
    contenedor.append(boton);
  }
}

// La fila 0 es la de abajo, así que se dibujan de la 5 a la 0.
function dibujarTablero(contenedor) {
  for (let fila = FILAS - 1; fila >= 0; fila--) {
    for (let columna = 0; columna < COLUMNAS; columna++) {
      const casilla = document.createElement('div');
      casilla.className = 'casilla';
      casilla.dataset.testid = `casilla-${fila}-${columna}`;
      casilla.setAttribute('role', 'gridcell');
      contenedor.append(casilla);
    }
  }
}

dibujarBotonesColumna(document.querySelector('[data-testid="columnas"]'));
dibujarTablero(document.querySelector('[data-testid="tablero"]'));

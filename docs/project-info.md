# Información del proyecto

## Qué es
Un cuatro en raya que se juega en el navegador, en un tablero de 7 columnas × 6 filas, entre dos personas o contra el ordenador.

## Para quién
Personas que quieren echar una partida rápida, solas contra el ordenador o con alguien al lado, sin instalar nada ni crear cuenta.

## Funciones
- Elegir el modo al empezar: **2 jugadores** (se turnan en el mismo equipo) o **contra el ordenador**.
- Tablero fijo de 7 × 6. Se pulsa una columna y la ficha cae a la casilla libre más baja.
- Turnos alternos entre rojo y amarillo; empieza siempre rojo. Se indica de quién es el turno.
- No se puede jugar en una columna llena.
- Detectar victoria con 4 fichas seguidas en horizontal, vertical o cualquiera de las dos diagonales.
- Detectar empate cuando el tablero se llena sin ganador.
- Resaltar las 4 fichas de la línea ganadora.
- Al terminar la partida, el tablero se bloquea hasta empezar otra.
- Botón **Nueva partida** que reinicia el tablero sin recargar la página.
- Ordenador sencillo: si puede ganar en esta jugada, gana; si no, si el rival puede ganar en la siguiente, le bloquea; si no, prefiere la columna más central disponible.

## Fuera de alcance
- Juego online o entre equipos distintos.
- Cuentas de usuario, ranking o guardar partidas.
- Marcador de victorias entre partidas.
- Deshacer jugadas.
- Tamaño de tablero configurable.
- Niveles de dificultad del ordenador o IA avanzada (minimax, etc.).
- Animaciones elaboradas, sonidos o temas visuales.

## Tecnología
- HTML, CSS y JavaScript sin framework (módulos ES), en el navegador. Sin servidor propio ni base de datos.
- La lógica del juego (tablero, turnos, victoria, empate, ordenador) va en módulos JS puros, separados de la interfaz, para poder probarla.
- Pruebas unitarias con **Vitest** y de extremo a extremo con **Playwright** (en `e2e/`). Se instalarán cuando hagan falta, avisando antes.

## Cómo se arranca
- Al usar módulos ES, la página se sirve con un servidor estático local en lugar de abrir el archivo directamente: `python3 -m http.server 8000` y abrir `http://localhost:8000`. (Si más adelante conviene un `npm start`, se propondrá antes.)
- Pruebas: `npm test` (Vitest) y `npx playwright test` (e2e).

## Datos y claves
Solo el estado de la partida en memoria; no se guarda nada al cerrar la página. No necesita claves ni `.env`.

## Cómo se prueba
- **Vertical:** rojo juega en la columna 1 cuatro veces y amarillo en la 2 tres veces, alternando → gana rojo y se resaltan las 4 fichas de la columna 1.
- **Horizontal:** rojo en columnas 1, 2, 3, 4 y amarillo en 1, 2, 3 (encima) → gana rojo.
- **Diagonal:** se prueban ambas direcciones (↗ y ↘) con una secuencia conocida → gana quien la completa.
- **Columna llena:** tras 6 fichas en una columna, pulsarla otra vez no cambia el tablero ni el turno.
- **Empate:** una secuencia de 42 jugadas sin 4 en raya → se muestra «Empate».
- **Ordenador:** con 3 fichas suyas en línea y hueco libre, juega ahí y gana; si el rival tiene 3 en línea con hueco, le bloquea.
- **Nueva partida:** después de una victoria, el botón deja el tablero vacío y el turno en rojo.

---

<details>
<summary>Ejemplo de referencia: calculadora de hipoteca (no es tu proyecto)</summary>

**Qué es:** una página que calcula la cuota mensual de una hipoteca.

**Para quién:** personas que están comparando hipotecas antes de ir al banco.

**Funciones:**
- Pedir importe, interés anual y años.
- Mostrar la cuota mensual.
- Avisar si falta un dato o no es válido.

**Fuera de alcance:** cuentas de usuario, guardar simulaciones y ofertas de bancos reales.

**Tecnología:** una página HTML con JavaScript que se abre en el navegador.

**Datos y claves:** solo los datos que escribe el usuario, que no se guardan. No necesita claves.

**Cómo se prueba:** 200.000 € al 3 % a 30 años = 843 €/mes.

</details>

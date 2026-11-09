# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla.

Para abrir la app en cualquier fase: `python3 -m http.server 8000` y abrir `http://localhost:8000`.

## Decisiones fijadas

Valen para todas las fases. Si alguna cambia, se actualiza aquí primero.

- **Tablero:** matriz `tablero[fila][columna]`, 6 filas × 7 columnas. La **fila 0 es la de abajo**. Cada casilla está vacía, roja o amarilla.
- **Numeración:** en el código, filas y columnas empiezan en 0 (columnas 0–6). En los textos y escenarios de prueba para personas se habla de «columna 1» a «columna 7» (columna 1 = índice 0).
- **Archivos:** `src/juego.js` (lógica: tablero, turnos, victoria, empate), `src/ordenador.js` (elección de jugada) y `src/interfaz.js` (DOM y eventos). Solo `interfaz.js` toca el DOM. Las pruebas de Vitest van junto a cada módulo (`*.test.js`); las de Playwright, en `e2e/`.
- **Jugar una columna:** sobre el tablero hay una fila de 7 botones, uno por columna, que se pueden pulsar con el ratón, el dedo o el teclado. Además, pulsar cualquier casilla de una columna juega en esa columna.
- **Selectores para pruebas:** atributos estables `data-testid` (`tablero`, `casilla-{fila}-{columna}`, `columna-{columna}`, `estado`, `nueva-partida`, `modo`). Las pruebas no dependen de clases CSS ni de la estructura del HTML.
- **Modo de juego:** el selector está siempre visible. Cambiar de modo empieza una partida nueva.
- **Desempate del ordenador:** cuando busca la columna más central, el orden de preferencia es 4, 3, 5, 2, 6, 1, 7 (en índices: 3, 2, 4, 1, 5, 0, 6). Con la misma distancia al centro, gana la de la izquierda.
- **Límite conocido del ordenador:** si el rival tiene dos jugadas ganadoras a la vez, el ordenador bloquea solo una y pierde. Es lo esperado, no un fallo.

## Fase 0 · Esqueleto y herramientas de prueba

**Objetivo:** la versión más pequeña posible: una página que se abre, muestra el nombre y un tablero vacío de 7 × 6, y con Playwright y el linter listos. Todavía no se puede jugar.

**Tareas:**
- [x] Limpiar los restos de la plantilla: quitar `GEMINI_API_KEY` de `.env.example` (la app no usa claves) y las entradas que no apliquen de `.gitignore` (Streamlit, Python), preguntando antes de borrar.
- [x] Crear `index.html`, `styles.css` y un módulo JS de arranque.
- [x] Mostrar el título «Cuatro en raya» y una cuadrícula vacía de 7 columnas × 6 filas con los `data-testid` acordados.
- [x] Preparar `package.json` con la versión de Node fijada (`engines`) y los scripts `test` (Vitest, a partir de la fase 1), `test:e2e` (Playwright) y `lint` (ESLint).
- [x] Instalar Playwright (avisando antes) **solo con Chromium**.
- [x] Configurar Playwright para que arranque y pare solo el servidor estático (`python3 -m http.server`) al ejecutar las pruebas.
- [x] Instalar ESLint (avisando antes) con una configuración mínima para módulos ES en el navegador.
- [x] Comprobar que `.gitignore` cubre `node_modules`, `test-results` y `playwright-report`.

**Pruebas:**
- Playwright (`e2e/`): la página carga, se ve «Cuatro en raya» y hay 42 casillas vacías.
- Playwright: la carga de la página no produce ningún error en la consola (falla si aparece uno).

**Cómo lo compruebo:** abro `http://localhost:8000` y veo el título y el tablero vacío; `npm run test:e2e` pasa **sin tener el servidor arrancado a mano**; `npm run lint` no da avisos.

**Hecho cuando:** la app se abre sin errores en la consola, se ven el nombre y el tablero, la prueba e2e y el linter pasan.

## Fase 1 · Poner fichas

**Objetivo:** dos personas pueden ir poniendo fichas por turnos. Aún no se detecta quién gana.

**Restricción:** sin base de datos ni almacenamiento de ningún tipo (tampoco `localStorage` ni archivos). El estado de la partida vive solo en memoria y se pierde al recargar la página.

**Tareas:**
- [ ] Instalar Vitest (avisando antes) y configurarlo para que **excluya `e2e/`**, de modo que no intente ejecutar las pruebas de Playwright.
- [ ] `src/juego.js` (sin interfaz): crear tablero, soltar ficha en una columna, cambiar de turno, saber si una columna está llena. Debe aceptar un tablero inicial dado, para poder montar situaciones en las pruebas.
- [ ] Al pulsar una columna (botón o casilla), la ficha cae a la casilla libre más baja.
- [ ] Turnos alternos; empieza rojo. Un texto (`data-testid="estado"`) indica de quién es el turno.
- [ ] Pulsar una columna llena no hace nada.

**Pruebas:**
- Vitest: la ficha cae a la fila 0, se apila, los turnos alternan, una columna llena rechaza la jugada sin cambiar turno ni tablero, y una columna fuera de rango (−1, 7) se rechaza.
- Playwright: pulsar la columna 1 dos veces deja una roja abajo y una amarilla encima, y el turno vuelve a rojo.
- Playwright: se puede jugar con el teclado (tabulador hasta el botón de una columna y Enter).

**Cómo lo compruebo:** abro la app, pulso varias columnas y veo que las fichas caen y alternan color; lleno una columna y compruebo que ya no admite más ni cambia el turno.

**Hecho cuando:** se puede llenar el tablero jugando a mano sin errores y `npm test`, `npm run test:e2e` y `npm run lint` pasan.

## Fase 2 · Ganar, empatar y volver a jugar

**Objetivo:** una partida completa entre dos personas, con ganador o empate y opción de jugar otra.

**Tareas:**
- [ ] Lógica: detectar 4 en raya en horizontal, vertical y las dos diagonales, devolviendo las 4 casillas ganadoras.
- [ ] Lógica: detectar empate con el tablero lleno y sin ganador. La victoria se comprueba **antes** que el empate.
- [ ] Construir y guardar como dato de prueba una secuencia de 42 jugadas que termina en empate, comprobada a mano y con la propia lógica.
- [ ] Interfaz: mostrar «Gana rojo», «Gana amarillo» o «Empate», resaltar las 4 fichas ganadoras y bloquear el tablero.
- [ ] Botón **Nueva partida** que vacía el tablero y deja el turno en rojo.

**Pruebas:**
- Vitest: victoria en cada una de las 4 direcciones, incluidas líneas pegadas a los bordes y esquinas; 3 en raya no gana; 5 en línea gana.
- Vitest: empate con la secuencia guardada de 42 jugadas.
- Vitest: si la jugada 42 completa un 4 en raya, el resultado es victoria, no empate.
- Vitest: tras una victoria, la lógica rechaza nuevas jugadas.
- Playwright: secuencia de victoria vertical → aparece «Gana rojo», hay 4 fichas resaltadas y pulsar el tablero no hace nada; «Nueva partida» deja el tablero vacío y el turno en rojo.
- Playwright: la secuencia de empate muestra «Empate».

**Cómo lo compruebo:** juego una partida hasta ganar en vertical, horizontal y diagonal; veo el mensaje y las 4 fichas resaltadas; pulso «Nueva partida» y empieza otra limpia.

**Hecho cuando:** se puede jugar una partida completa de principio a fin y todas las pruebas y el linter pasan.

## Fase 3a · Lógica del ordenador

**Objetivo:** un módulo puro que, dado un tablero y un color, elige columna. No toca la interfaz.

**Tareas:**
- [ ] `src/ordenador.js`: si puede ganar en esta jugada, gana; si no, bloquea la victoria inmediata del rival; si no, la columna libre más central según el orden de desempate acordado.
- [ ] Nunca devuelve una columna llena. Si el tablero está lleno o la partida ha terminado, no devuelve jugada.

**Pruebas (Vitest):**
- Con el tablero vacío elige la columna 4 (índice 3).
- Con la columna 4 llena elige la 3; con la 4 y la 3 llenas, la 5 (comprueba el desempate).
- Completa su 4 en raya cuando puede, en cada dirección.
- Bloquea el 4 en raya inmediato del rival.
- Si puede ganar y a la vez el rival amenaza, prefiere ganar.
- Nunca elige una columna llena, incluido un tablero con una sola columna libre.
- Con dos amenazas del rival, bloquea una (documenta el límite conocido).

**Cómo lo compruebo:** reviso las pruebas y su resultado; aún no hay cambios visibles en la app.

**Hecho cuando:** todas las pruebas y el linter pasan.

## Fase 3b · Jugar contra el ordenador

**Objetivo:** jugar contra el ordenador además de en modo 2 jugadores.

**Tareas:**
- [ ] Selector de modo: «2 jugadores» o «Contra el ordenador». Cambiar de modo empieza una partida nueva.
- [ ] En modo ordenador, la persona es roja y el ordenador (amarillo) juega solo justo después, con una pausa breve para que se vea.
- [ ] La duración de la pausa es configurable, y las pruebas la ponen a 0 o casi para que no sean lentas ni fallen por tiempos.
- [ ] Mientras el ordenador piensa, no se puede pulsar el tablero; el texto de estado lo indica.
- [ ] La jugada pendiente del ordenador **se cancela** al pulsar «Nueva partida» o al cambiar de modo, para que no ponga ficha en una partida nueva.

**Pruebas:**
- Playwright: en modo ordenador, tras una jugada roja aparece sola una ficha amarilla.
- Playwright: partida en la que el ordenador gana → termina con «Gana amarillo». La secuencia se construye y se comprueba antes con la lógica de la fase 3a.
- Playwright: pulsar varias veces seguidas durante la pausa del ordenador solo coloca una ficha roja.
- Playwright: pulsar «Nueva partida» durante la pausa deja el tablero vacío y no aparece ninguna ficha amarilla después.
- Playwright: cambiar a «2 jugadores» durante la pausa deja el tablero vacío y el ordenador no juega.
- Playwright: el modo «2 jugadores» sigue funcionando como en la fase 2.

**Cómo lo compruebo:** elijo «Contra el ordenador», pongo 3 fichas en línea y veo que me bloquea; le dejo un hueco ganador y veo que lo aprovecha; pulso «Nueva partida» justo después de jugar y compruebo que no aparece ninguna ficha; vuelvo a «2 jugadores» y funciona como en la fase 2.

**Hecho cuando:** los dos modos funcionan de principio a fin y todas las pruebas y el linter pasan.

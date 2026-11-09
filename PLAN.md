# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla.

Para abrir la app en cualquier fase: `python3 -m http.server 8000` y abrir `http://localhost:8000`.

## Fase 0 · Esqueleto

**Objetivo:** la versión más pequeña posible: una página que se abre, muestra el nombre y un tablero vacío de 7 × 6. Todavía no se puede jugar.

**Tareas:**
- [ ] Crear `index.html`, `styles.css` y un módulo JS de arranque.
- [ ] Mostrar el título «Cuatro en raya» y una cuadrícula vacía de 7 columnas × 6 filas.
- [ ] Preparar `package.json` e instalar Playwright (avisando antes) con un `.gitignore` para `node_modules`.

**Pruebas:**
- Playwright (`e2e/`): la página carga, se ve «Cuatro en raya» y hay 42 casillas vacías.

**Cómo lo compruebo:** abro `http://localhost:8000` y veo el título y el tablero vacío; `npx playwright test` pasa.

**Hecho cuando:** la app se abre sin errores en la consola, se ven el nombre y el tablero, y la prueba pasa.

## Fase 1 · Poner fichas

**Objetivo:** dos personas pueden ir poniendo fichas por turnos. Aún no se detecta quién gana.

**Tareas:**
- [ ] Módulo de lógica (sin interfaz): crear tablero, soltar ficha en una columna, cambiar de turno, saber si una columna está llena.
- [ ] Al pulsar una columna, la ficha cae a la casilla libre más baja.
- [ ] Turnos alternos; empieza rojo. Un texto indica de quién es el turno.
- [ ] Pulsar una columna llena no hace nada.
- [ ] Instalar Vitest (avisando antes) para las pruebas de la lógica.

**Pruebas:**
- Vitest: la ficha cae abajo, se apila, los turnos alternan, una columna llena rechaza la jugada sin cambiar turno.
- Playwright: pulsar la columna 1 dos veces deja una roja abajo y una amarilla encima, y el turno vuelve a rojo.

**Cómo lo compruebo:** abro la app, pulso varias columnas y veo que las fichas caen y alternan color; lleno una columna y compruebo que ya no admite más ni cambia el turno.

**Hecho cuando:** se puede llenar el tablero jugando a mano sin errores y `npm test` y `npx playwright test` pasan.

## Fase 2 · Ganar, empatar y volver a jugar

**Objetivo:** una partida completa entre dos personas, con ganador o empate y opción de jugar otra.

**Tareas:**
- [ ] Lógica: detectar 4 en raya en horizontal, vertical y las dos diagonales, devolviendo las 4 casillas ganadoras.
- [ ] Lógica: detectar empate con el tablero lleno y sin ganador.
- [ ] Interfaz: mostrar «Gana rojo», «Gana amarillo» o «Empate», resaltar las 4 fichas ganadoras y bloquear el tablero.
- [ ] Botón **Nueva partida** que vacía el tablero y deja el turno en rojo.

**Pruebas:**
- Vitest: victoria en cada una de las 4 direcciones (incluidos bordes del tablero), empate con 42 jugadas sin línea, 3 en raya no gana.
- Playwright: secuencia de victoria vertical → aparece «Gana rojo», hay 4 fichas resaltadas y pulsar el tablero no hace nada; «Nueva partida» deja el tablero vacío.

**Cómo lo compruebo:** juego una partida hasta ganar en vertical, horizontal y diagonal; veo el mensaje y las 4 fichas resaltadas; pulso «Nueva partida» y empieza otra limpia.

**Hecho cuando:** se puede jugar una partida completa de principio a fin y todas las pruebas pasan.

## Fase 3 · Contra el ordenador

**Objetivo:** jugar contra el ordenador además de en modo 2 jugadores.

**Tareas:**
- [ ] Selector de modo: «2 jugadores» o «Contra el ordenador». Cambiar de modo empieza una partida nueva.
- [ ] Lógica del ordenador (sin interfaz): si puede ganar, gana; si no, bloquea la victoria inmediata del rival; si no, la columna libre más central.
- [ ] En modo ordenador, la persona es roja y el ordenador (amarillo) juega solo justo después, con una pausa breve para que se vea.
- [ ] Mientras el ordenador piensa, no se puede pulsar el tablero.

**Pruebas:**
- Vitest: el ordenador completa su 4 en raya cuando puede, bloquea el del rival, prefiere ganar a bloquear y elige el centro con el tablero vacío; nunca elige una columna llena.
- Playwright: en modo ordenador, tras una jugada roja aparece sola una ficha amarilla; una partida en la que el ordenador puede ganar termina con «Gana amarillo».

**Cómo lo compruebo:** elijo «Contra el ordenador», pongo 3 fichas en línea y veo que me bloquea; le dejo un hueco ganador y veo que lo aprovecha; vuelvo a «2 jugadores» y funciona como en la fase 2.

**Hecho cuando:** los dos modos funcionan de principio a fin y todas las pruebas pasan.

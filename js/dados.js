let puntosJugador = 0;
let puntosComputadora = 0;
let victoriasJugador = 0;
let victoriasComputadora = 0;
let dadosJugador = [];
let dadosComputadora = [];
let rondaEnCurso = false;
let dadoExtraDisponible = false;

const zonaDados = document.getElementById("zonaDados");
const mensaje = document.getElementById("mensajeJuego");
const btnComenzar = document.getElementById("btnComenzar");
const btnTirarDados = document.getElementById("btnTirarDados");
const btnDadoExtra = document.getElementById("btnDadoExtra");
const btnPasar = document.getElementById("btnPasar");
const btnReiniciar = document.getElementById("btnReiniciar");

const puntosJ = document.getElementById("puntosJugador");
const puntosC = document.getElementById("puntosComputadora");
const victoriasJ = document.getElementById("victoriasJugador");
const victoriasC = document.getElementById("victoriasComputadora");

// funciones base

function tirarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function mostrarDados(jugador, dados) {
  const contenedor = document.createElement("div");
  contenedor.classList.add("bloque-dados");
  contenedor.dataset.jugador = String(jugador).toLowerCase();

  const titulo = document.createElement("h3");
  titulo.textContent = jugador;
  contenedor.appendChild(titulo);

  dados.forEach(valor => {
    const dadoEl = document.createElement("div");
    dadoEl.classList.add("dado");
    dadoEl.textContent = valor;
    contenedor.appendChild(dadoEl);
  });

  zonaDados.appendChild(contenedor);
  return contenedor;
}

function actualizarMarcadores() {
  puntosJ.textContent = puntosJugador;
  puntosC.textContent = puntosComputadora;
  victoriasJ.textContent = victoriasJugador;
  victoriasC.textContent = victoriasComputadora;
}

function limpiarZonaDados() {
  zonaDados.innerHTML = "";
}

function comenzarJuego() {
  puntosJugador = 0;
  puntosComputadora = 0;
  dadoExtraDisponible = false;
  rondaEnCurso = true;
  mensaje.textContent = "¡Comienza la partida! Tirá los dados.";
  limpiarZonaDados();

  btnComenzar.disabled = true;
  btnTirarDados.disabled = false;
  btnDadoExtra.disabled = true;
  btnPasar.disabled = true;
  btnReiniciar.disabled = true;
  actualizarMarcadores();
}

function tirarDados() {
  if (!rondaEnCurso) return;

  limpiarZonaDados();

  dadosJugador = [tirarDado(), tirarDado()];
  dadosComputadora = [tirarDado(), tirarDado()];

  mostrarDados("Jugador", dadosJugador);
  mostrarDados("Computadora", dadosComputadora);

  const totalJugador = dadosJugador.reduce((a, b) => a + b, 0);
  const totalComputadora = dadosComputadora.reduce((a, b) => a + b, 0);

  puntosJugador += totalJugador;
  puntosComputadora += totalComputadora;

  actualizarMarcadores();

  mensaje.textContent = `Tiraste ${dadosJugador.join(" y ")} → +${totalJugador} puntos.`;

  dadoExtraDisponible = true;
  btnDadoExtra.disabled = false;
  btnPasar.disabled = false;
  btnTirarDados.disabled = true;

  verificarPuntajes();
}

function tirarDadoExtra() {
  if (!dadoExtraDisponible || !rondaEnCurso) return;

  const dadoExtra = tirarDado();
  mensaje.textContent = `Dado extra: ${dadoExtra}`;

  const contJugador = zonaDados.querySelector('.bloque-dados[data-jugador="jugador"]');
  if (contJugador) {
    const dadoEl = document.createElement("div");
    dadoEl.classList.add("dado");
    dadoEl.textContent = dadoExtra;
    contJugador.appendChild(dadoEl);
  }

  if (dadosJugador.includes(dadoExtra)) {
    const suma = dadosJugador.reduce((a, b) => a + b, 0) + dadoExtra;
    const penalizacion = Math.floor(suma / 2);
    puntosJugador += penalizacion;
    mensaje.textContent += ` — Repetido: se suman (${suma}) y se divide → +${penalizacion} puntos.`;
  } else {
    puntosJugador += dadoExtra;
    mensaje.textContent += ` — No repetido: +${dadoExtra} puntos.`;
  }

  actualizarMarcadores();
  dadoExtraDisponible = false;
  btnDadoExtra.disabled = true;
  btnPasar.disabled = true;

  verificarPuntajes();
  if (rondaEnCurso) btnTirarDados.disabled = false;
}

function pasarTurno() {
  mensaje.textContent = "Has decidido pasar tu dado extra. Se continúa la partida.";
  dadoExtraDisponible = false;
  btnDadoExtra.disabled = true;
  btnPasar.disabled = true;
  btnTirarDados.disabled = false;
}

function verificarPuntajes() {
  actualizarMarcadores();

  if (puntosJugador >= 50 || puntosComputadora >= 50) {
    rondaEnCurso = false;

    if (puntosJugador > puntosComputadora) {
      victoriasJugador++;
      mensaje.textContent = `🎉 Ganaste esta ronda (${puntosJugador} vs ${puntosComputadora})`;
    } else if (puntosComputadora > puntosJugador) {
      victoriasComputadora++;
      mensaje.textContent = `💻 La computadora ganó esta ronda (${puntosComputadora} vs ${puntosJugador})`;
    } else {
      mensaje.textContent = `🤝 Empate (${puntosJugador} puntos cada uno)`;
    }

    actualizarMarcadores();

    if (victoriasJugador >= 3 || victoriasComputadora >= 3) {
      finDelJuego();
    } else {
      btnTirarDados.disabled = true;
      btnDadoExtra.disabled = true;
      btnPasar.disabled = true;
      btnComenzar.disabled = false;
      btnComenzar.textContent = "Siguiente Ronda";
      mensaje.textContent += " — Pulsa 'Siguiente Ronda' para continuar.";
    }
  }
}

function finDelJuego() {
  btnComenzar.disabled = true;
  btnTirarDados.disabled = true;
  btnDadoExtra.disabled = true;
  btnPasar.disabled = true;
  btnReiniciar.disabled = false;

  if (victoriasJugador >= 3) {
    mensaje.textContent = `¡Ganaste la partida con ${victoriasJugador} victorias!`;
  } else {
    mensaje.textContent = `La computadora ganó la partida con ${victoriasComputadora} victorias.`;
  }

  // Guardado linkeado a puntuaciones
  guardarPuntaje("Dados", victoriasJugador);
}

function reiniciarPartida() {
  puntosJugador = 0;
  puntosComputadora = 0;
  victoriasJugador = 0;
  victoriasComputadora = 0;
  dadoExtraDisponible = false;
  rondaEnCurso = false;
  actualizarMarcadores();
  limpiarZonaDados();

  mensaje.textContent = "Juego reiniciado. Pulsa 'Comenzar' para jugar otra vez.";
  btnComenzar.disabled = false;
  btnReiniciar.disabled = true;
  btnComenzar.textContent = "Comenzar";
}

// save de nombre y puntuaciones

function guardarNombreJugador() {
  const nombreInput = document.getElementById("nombreJugador");
  if (!nombreInput) return null;

  const nombre = nombreInput.value.trim();
  if (!nombre) {
    alert("Por favor, escribí tu nombre antes de jugar.");
    return null;
  }

  localStorage.setItem("nombreJugador", nombre);
  alert(`Bienvenido, ${nombre}. ¡Tu nombre ha sido guardado!`);
  return nombre;
}

function obtenerNombreJugador() {
  return localStorage.getItem("nombreJugador") || "Jugador Anónimo";
}

function guardarPuntaje(juego, puntaje) {
  const nombre = obtenerNombreJugador();
  const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
  puntuaciones.push({
    jugador: nombre,
    juego,
    puntaje,
    fecha: new Date().toLocaleString()
  });
  localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
}

// eventos

btnComenzar.addEventListener("click", comenzarJuego);
btnTirarDados.addEventListener("click", tirarDados);
btnDadoExtra.addEventListener("click", tirarDadoExtra);
btnPasar.addEventListener("click", pasarTurno);
btnReiniciar.addEventListener("click", reiniciarPartida);

const btnGuardarNombre = document.getElementById("btnGuardarNombre");

if (btnGuardarNombre) {

  btnGuardarNombre.addEventListener("click", guardarNombreJugador);
}

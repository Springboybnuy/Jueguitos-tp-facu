const palos = ["oros", "copas", "espadas", "bastos"];
const valores = ["1", "2", "3", "4", "5", "6", "7", "sota", "caballo", "rey"];

let mazo = [];
let descarte = [];
let cartasJugador = [];
let cartasComputadora = [];
let puntajeJugador = 0;
let puntajeComputadora = 0;
let juegoTerminado = false;

// Dom

const contJugador = document.getElementById("cartas-jugador");
const contComputadora = document.getElementById("cartas-computadora");
const contDescartada = document.getElementById("carta-descartada");
const mensaje = document.getElementById("mensaje");
const btnNuevaRonda = document.getElementById("btn-nueva-ronda");
const btnDescartar = document.getElementById("btn-descartar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const spanJugador = document.getElementById("puntaje-jugador");
const spanComputadora = document.getElementById("puntaje-computadora");
// Dom





// ==== FUNCIONES DE MAZO ====


function crearMazo() {
  mazo = [];
  for (const palo of palos) {
    for (const valor of valores) {
      mazo.push({ palo, valor });
    }
  }
}

function mezclarMazo() {
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
}

function robarCarta() {
  if (mazo.length === 0) {

    // Mezcla el mazo al acabarse 

    if (descarte.length > 0) {
      mazo = [...descarte];
      descarte = [];
      mezclarMazo();
      mensaje.textContent = "Se remezclaron las cartas descartadas.";
    } else {
      return null;
    }
  }
  return mazo.pop();
}


// Funciones del juego

function iniciarRonda() {
  if (juegoTerminado) return;

  crearMazo();
  mezclarMazo();
  cartasJugador = [robarCarta(), robarCarta()];
  cartasComputadora = [robarCarta(), robarCarta()];
  actualizarCartas();
  mensaje.textContent = "Ronda iniciada.";
  btnDescartar.disabled = false;

  verificarParInicial();
}

function verificarParInicial() {

  const parJugador = cartasJugador[0].valor === cartasJugador[1].valor;

  const parComputadora = cartasComputadora[0].valor === cartasComputadora[1].valor;

  if (parJugador || parComputadora) {
    if (parJugador && parComputadora) {
      mensaje.textContent = "Ambos formaron par Ronda empatada.";
    } else if (parJugador) {
      puntajeJugador++;
      mensaje.textContent = "Formaste un par Ganas 1 punto.";
    } else {
      puntajeComputadora++;
      mensaje.textContent = "La computadora formó un par. Gana 1 punto.";
    }
    actualizarPuntaje();
    verificarFinDeJuego();
  }
}

function actualizarCartas() {
  contJugador.innerHTML = "";
  contComputadora.innerHTML = "";

  cartasJugador.forEach((carta, index) => {
    const div = document.createElement("button");
    div.textContent = `${carta.valor} de ${carta.palo}`;
    div.classList.add("carta", "btn-carta", carta.palo);
    div.onclick = () => descartarCarta(index);
    contJugador.appendChild(div);
  });

  cartasComputadora.forEach(() => {
    const div = document.createElement("div");
    div.textContent = "🐇";
    div.classList.add("carta");
    contComputadora.appendChild(div);
  });
}

function descartarCarta(indice) {
  if (juegoTerminado) return;

  const cartaJugadorDescartada = cartasJugador.splice(indice, 1)[0];
  descarte.push(cartaJugadorDescartada);

  const indiceComp = Math.floor(Math.random() * cartasComputadora.length);
  const cartaCompDescartada = cartasComputadora.splice(indiceComp, 1)[0];
  descarte.push(cartaCompDescartada);

  contDescartada.textContent = `${cartaCompDescartada.valor} de ${cartaCompDescartada.palo}`;

  // Robar nuevas cartas
  cartasJugador.push(robarCarta());
  cartasComputadora.push(robarCarta());

  actualizarCartas();

  // Verificar pares
  const parJugador = cartasJugador[0].valor === cartasJugador[1].valor;
  const parComputadora = cartasComputadora[0].valor === cartasComputadora[1].valor;

  if (parJugador || parComputadora) {
    if (parJugador && parComputadora) {
      mensaje.textContent = " Ambos formaron par al mismo tiempo ";
    } else if (parJugador) {
      puntajeJugador++;
      mensaje.textContent = "Formaste un par, Ganas 1 punto.";
    } else {
      puntajeComputadora++;
      mensaje.textContent = "La computadora formó un par y gana 1 punto.";
    }
    actualizarPuntaje();
    verificarFinDeJuego();
  }
}

function actualizarPuntaje() {
  spanJugador.textContent = puntajeJugador;
  spanComputadora.textContent = puntajeComputadora;
}

function verificarFinDeJuego() {
  if (puntajeJugador >= 3 && puntajeComputadora >= 3) {
    mensaje.textContent = "Empate a 3 puntos, Se jugará una ronda de desempate.";
    puntajeJugador = 3;
    puntajeComputadora = 3;
    actualizarPuntaje();
    return;
  }

  if (puntajeJugador >= 3 && puntajeJugador > puntajeComputadora) {
    mensaje.textContent = `¡Ganaste! Marcador final: ${puntajeJugador} - ${puntajeComputadora}`;
    terminarJuego();
  } else if (puntajeComputadora >= 3 && puntajeComputadora > puntajeJugador) {
    mensaje.textContent = `La computadora ganó. Marcador final: ${puntajeComputadora} - ${puntajeJugador}`;
    terminarJuego();
  }
}

function terminarJuego() {
  juegoTerminado = true;
  btnDescartar.disabled = true;
  btnNuevaRonda.disabled = true;
  btnReiniciar.style.display = "inline-block";

  // === Guardar puntuación al terminar ===
  guardarPuntaje("Cartas", puntajeJugador);
}


// reiniciar el juego

function reiniciarJuego() {
  puntajeJugador = 0;
  puntajeComputadora = 0;
  actualizarPuntaje();
  mensaje.textContent = "Partida reiniciada. Presiona 'Nueva ronda' para comenzar.";
  juegoTerminado = false;
  btnReiniciar.style.display = "none";
  btnNuevaRonda.disabled = false;
  contDescartada.textContent = "";
  contJugador.innerHTML = "";
  contComputadora.innerHTML = "";
}


// evemtos

btnNuevaRonda.addEventListener("click", iniciarRonda);
btnReiniciar.addEventListener("click", reiniciarJuego);
btnDescartar.addEventListener("click", () => {
  mensaje.textContent = "Elegí una carta para descartar.";
});





//                                           info guardado

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

// === MODIFICADO: guardado compatible con la página de puntuaciones ===
function guardarPuntaje(juego, puntaje) {
  const nombre = obtenerNombreJugador();
  const nuevaPuntuacion = {
    jugador: nombre,
    juego: juego,
    puntaje: puntaje,
    fecha: new Date().toLocaleString()
  };

  const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
  puntuaciones.push(nuevaPuntuacion);
  localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
}


// guardado nombre

const btnGuardarNombre = document.getElementById("btnGuardarNombre");
if (btnGuardarNombre) {
  btnGuardarNombre.addEventListener("click", guardarNombreJugador);
}












/* quesoo */

/* 
function despedir()
{
    console.log("quesoo");
}

for (let i = 0; i < 5; i++) {
  setTimeout (despedir, 1000);
}

*/

/* quesoo */
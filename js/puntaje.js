const lista = document.getElementById("lista-puntuaciones");
const btnBorrar = document.getElementById("btn-borrar-puntuaciones");

// carga del almacenamiento

let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];

// Mostrar puntuaciones

function mostrarPuntuaciones() {
  lista.innerHTML = "";

  if (puntuaciones.length === 0) {
    lista.innerHTML = "<p class='mensaje'>No hay puntuaciones registradas aún.</p>";
    return;
  }

  // ordenar de mayor a menor puntaje

  puntuaciones.sort((a, b) => b.puntaje - a.puntaje);

  puntuaciones.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("tarjeta-puntuacion");
    div.innerHTML = `
      <div class="jugador">${p.jugador}</div>
      <div class="juego">${p.juego}</div>
      <div class="puntos">${p.puntaje} pts</div>
      <div class="fecha">${p.fecha}</div>
    `;
    lista.appendChild(div);
  });
}


// Borrar historial
btnBorrar.addEventListener("click", () => {
  localStorage.removeItem("puntuaciones");
  puntuaciones = [];
  lista.innerHTML = "<p class='mensaje'>Historial borrado.</p>";
});






mostrarPuntuaciones();

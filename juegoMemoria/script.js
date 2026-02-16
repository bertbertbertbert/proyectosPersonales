let cartas = ["alberto", "alberto", "montse", "montse", /* "especial", */ "isma", "isma", "ferran", "ferran", "juanma", "juanma", "adri", "adri", "sergio", "sergio", "jose", "jose", "paula", "paula", "isaac", "isaac"/* , "marc_gregorio" */];

let cartasMezcladas;
let carta1;
let carta2;
let cartasBloqueadas = true;
let id = 0;
let click = 1;
let aciertosSeguidos = 0;
let intentos = 0;
let todasLasCartas = [];
let botonStart= document.getElementById("botonStart");
let racha=0;

//TEMPORIZADOR
let duracion = 60000;
let inicio = null;
let tiempoRestante = duracion;
let animacionId = null;
let juegoActivo = false;

const iniciarTemporizador = () => {
  inicio = performance.now();
  juegoActivo = true;
  animacionId = requestAnimationFrame(actualizarTemporizador);
};

const calcularDuracion = () => {

  if (racha === 0) {
    duracion = 60000;
  } 
  else if (racha === 1) {
    duracion = 55000;
  } 
  else if (racha === 2) {
    duracion = 50000;
  } 
  else if (racha >= 3) {
    duracion = 50000 - ((racha - 2) * 3000);
  }
  tiempoRestante = duracion;
};

const actualizarTemporizador = (ahora) => {
  if (!juegoActivo) return;

  let tiempoTranscurrido = ahora - inicio;
  tiempoRestante = duracion - tiempoTranscurrido;

  if (tiempoRestante <= 0) {
    tiempoRestante = 0;
    document.getElementById("tiempo").innerText = "0:00";
    finalizarJuego();
      botonStart.disabled = true;
    return;
  }

  let segundos = Math.floor(tiempoRestante / 1000);
  let milisegundos = Math.floor((tiempoRestante % 1000) / 10);

  document.getElementById("tiempo").innerText =
    `${segundos}:${milisegundos.toString().padStart(2, "0")}`;

  animacionId = requestAnimationFrame(actualizarTemporizador);
};

const mostrarTiempoDisponible = () => {
  let segundos = Math.floor(duracion / 1000);
  document.getElementById("tiempo").innerText = `${segundos}:00`;
};

const mostrarRacha = () => {
  document.getElementById("racha").innerText = racha;
};

const finalizarJuego = () => {
  juegoActivo = false;
  cancelAnimationFrame(animacionId);
  cartasBloqueadas = true;
  botonStart.disabled = false;
};

//CREAR CARTAS (YA VISIBLES)
const crearTablero = () => {
    id = 0;
  todasLasCartas.forEach(carta => {
    carta.remove();
  });

  todasLasCartas = [];
  cartasMezcladas = _.shuffle(cartas);
  for (let i = 0; i < cartasMezcladas.length; i++) {
    let carta = document.createElement('img');
    carta.id = id;
    id++;

    carta.src = "img/contra.png";
    carta.classList.add('carta');
    document.body.appendChild(carta);

    todasLasCartas.push(carta);

    carta.addEventListener('click', e => {

      if (cartasBloqueadas || !juegoActivo) return;

      if (cartasMezcladas[e.target.id] === "especial") {
        cartasBloqueadas = true;
        e.target.src = "img/especial.png";
        e.target.classList.add('especialUsada');
        setTimeout(() => {
          cartasBloqueadas = false;
        }, 1000);
        cartaFaustino();
        return;
      }

      if (cartasMezcladas[e.target.id] === "marc_gregorio") {
        cartasBloqueadas = true;
        let numeroRandom = Math.floor(Math.random() * 10);

        if (numeroRandom < 7) {
          e.target.src = "img/marc.png";
          setTimeout(() => {
            cartaMarc();
          }, 500);
        } else {
          e.target.src = "img/gregorio.png";
          cartaGregorio();
        }
        return;
      }

      if (click == 1) {
        manejarCarta1(e.target);
      } else {
        manejarCarta2(e.target);
      }

    });
  }
};


//CARTAS ESPECIALES
const cartaFaustino = () => {
  let numeroRandom = Math.floor(Math.random() * 100);
  let restaFaustino = numeroRandom < 50 ? 2 : numeroRandom < 80 ? 3 : 4;

  if (intentos >= restaFaustino) {
    intentos -= restaFaustino;
  } else {
    intentos = 0;
  }
};

const cartaMarc = () => {
  todasLasCartas.forEach(carta => {
    if (!carta.classList.contains("resuelta") &&
      !carta.classList.contains("especialUsada") &&
      !carta.classList.contains("seleccionada")) {
      carta.src = "img/" + cartasMezcladas[carta.id] + ".png";
      carta.classList.add("marc");
    }
  });

  setTimeout(() => {
    todasLasCartas.forEach(carta => {
      if (carta.classList.contains("marc")) {
        carta.src = "img/contra.png";
        carta.classList.remove("marc");
      }
    });
    cartasBloqueadas = false;
  }, 2000);
};

const cartaGregorio = () => {
  cartasBloqueadas = true;

  let nuevaBaraja = [];

  for (let i = 0; i < cartasMezcladas.length; i++) {
    if (!todasLasCartas[i].classList.contains("resuelta")) {
      nuevaBaraja.push(cartasMezcladas[i]);
    }
  }

  setTimeout(() => {
    cartasMezcladas = _.shuffle(nuevaBaraja);
    location.reload();
  }, 1000);
};


//LOGICA CARTAS NORMALES
const manejarCarta1 = (carta) => {
  carta1 = carta;
  carta1.classList.add('seleccionada');
  carta1.src = "img/" + cartasMezcladas[carta1.id] + ".png";
  click = 2;
};

const manejarCarta2 = (carta) => {
  carta2 = carta;
  carta2.src = "img/" + cartasMezcladas[carta2.id] + ".png";
  click = 1;
  cartasBloqueadas = true;
  setTimeout(comprobarIguales, 1000);
};

const comprobarIguales = () => {

  if (cartasMezcladas[carta1.id] !== cartasMezcladas[carta2.id]) {
    carta1.src = "img/contra.png";
    carta1.classList.remove('seleccionada');
    carta2.src = "img/contra.png";
    aciertosSeguidos = 0;
    intentos++;
  } else {
    carta1.classList.add('resuelta');
    carta2.classList.add('resuelta');
    aciertosSeguidos++;
    if (aciertosSeguidos > 1) intentos--;
  }

  cartasBloqueadas = false;

  let cartasResueltas = document.querySelectorAll(".resuelta").length;
  if (cartasResueltas === cartasMezcladas.length) {
   finalizarJuego();
  racha++;
  calcularDuracion();
  crearTablero();
  mostrarRacha();
  mostrarTiempoDisponible();
  }
};


//BOTÓN START
botonStart.addEventListener("click", () => {

  cartasBloqueadas = false;
  juegoActivo = true;

  inicio = performance.now();
  tiempoRestante = duracion;

  botonStart.disabled = true;

  animacionId = requestAnimationFrame(actualizarTemporizador);
});


//CARGAR CARTAS 
crearTablero();
mostrarRacha();
mostrarTiempoDisponible();
let cartas = ["alberto", "alberto", "montse", "montse", "especial", "isma", "isma", "ferran", "ferran", "juanma", "juanma", "adri", "adri", "sergio", "sergio", "jose", "jose", "paula", "paula", "isaac", "isaac", "marc_gregorio"];
let cartasMezcladas = _.shuffle(cartas);
let carta1;
let carta2;
let cartasBloqueadas = false;
let id = 0;
let click = 1;
let intentos = document.getElementById("Intentos");
let botonFausto = document.getElementById("usarFaustino");
botonFausto.disabled = false;
let contenedorFaustino = document.getElementById("contendorFaustino");
botonFausto.style.display = "none";
let especialFaustino = document.getElementById("especial");
let aciertosSeguidos = 0;
let cartaEspecial = false;
intentos = 0
let todasLasCartas = [];
//iniciar juego
const inicarJuego = () => {
  for (let i = 0; i < cartasMezcladas.length; i++) {
    let carta = document.createElement('img');
    carta.id = id;
    document.body.appendChild(carta);
    id++;
    carta.src = "img/contra.png";
    carta.classList.add('carta');
    todasLasCartas.push(carta);

    carta.addEventListener('click', e => {

      if (cartasBloqueadas) return;

      if (cartasMezcladas[e.target.id] === "especial") {
        console.log("Carta especial pulsada");
        cartasBloqueadas = true;
        e.target.src = "img/especial.png";
        e.target.classList.add('especialUsada');
        setTimeout(() => {
          cartasBloqueadas = false;
        }, 1000);
        cartaFaustino();
        return;
      } else if ((cartasMezcladas[e.target.id] === "marc_gregorio")) {
        cartasBloqueadas = true;
        let numeroRandom = Math.floor(Math.random() * 10);
        if (numeroRandom < 7) {
          e.target.src = "img/marc.png";
          setTimeout(() => {
            cartaMarc();
          }, 500);

          return;
        } else {
          e.target.src = "img/gregorio.png";
          cartaGregorio();
          return;
        }
      }
      if (e.target.classList.contains('carta') && e.target.src != "img/especial.png") {
        if (click == 1) {
          manejarCarta1(e.target);
        } else {
          manejarCarta2(e.target);
        }
      }
    });
  }
}

const cartaFaustino = () => {
  let numeroRandom = Math.floor(Math.random() * 100);
  console.log("Número aleatorio: " + numeroRandom);
  let restaFaustino;
  if (numeroRandom < 50) {
    restaFaustino = 2;
  } else if (numeroRandom < 80) {
    restaFaustino = 3;
  } else {
    restaFaustino = 4;
  }
  botonFausto.style.display = "block";
  especialFaustino.innerText = restaFaustino + " ";
  contenedorFaustino.style.visibility = "visible";
  botonFausto.addEventListener('click', () => {
    console.log("Botón de Faustino pulsado");
    if (intentos >= restaFaustino) {
      intentos -= restaFaustino;
    } else {
      intentos = 0;
    }
    document.getElementById("Intentos").innerText = intentos;
    botonFausto.disabled = true;
  });
}

const cartaMarc = () => {
  todasLasCartas.forEach(carta => {
    if (!carta.classList.contains("resuelta") && carta.id != cartasMezcladas.indexOf("marc_gregorio") && !carta.classList.contains("especialUsada") && !carta.classList.contains("seleccionada")) {
      carta.classList.add("marc");
      carta.src = "img/" + cartasMezcladas[carta.id] + ".png";
    }
  });
  setTimeout(() => {
    todasLasCartas.forEach(carta => {
      if (carta.classList.contains("marc")) {
        carta.src = "img/contra.png";
      }
    });
  }, 2000);
  cartasBloqueadas = false;
}

const cartaGregorio = () => {
  cartasBloqueadas = true;
  let comprobarCartaEspecial;
  let indexCartaEspecial;
  indexCartaEspecial = cartasMezcladas.indexOf("especial");
  comprobarCartaEspecial = todasLasCartas[indexCartaEspecial];
  let cartaEspecialUsada = comprobarCartaEspecial.classList.contains("especialUsada");
  let nuevaBaraja = [];
  for (let i = 0; i < cartasMezcladas.length; i++) {
    if (!todasLasCartas[i].classList.contains("resuelta") && todasLasCartas[i].id != cartasMezcladas.indexOf("marc_gregorio") && !cartaEspecialUsada) {
      nuevaBaraja.push(cartasMezcladas[i]);
    }
  }
  setTimeout(() => {
    document.querySelectorAll(".carta").forEach(c => c.remove());
    todasLasCartas = [];
    id = 0;
    click = 1;
    cartasMezcladas = _.shuffle(nuevaBaraja);
    cartasBloqueadas = false;
    inicarJuego();
  }, 1000);
};

const manejarCarta1 = (carta) => {
  carta1 = carta;
  carta1.classList.add('seleccionada');
  carta1.src = "img/" + cartasMezcladas[carta1.id] + ".png";
  click = 2;
}

const manejarCarta2 = (carta) => {
  carta2 = carta;
  carta2.src = "img/" + cartasMezcladas[carta2.id] + ".png";
  click = 1;
  cartasBloqueadas = true;
  setTimeout(comprobarIguales, 1000);
}

const comprobarIguales = () => {
  if (cartasMezcladas[carta1.id] !== cartasMezcladas[carta2.id]) {
    carta1.src = "img/contra.png";
    carta1.classList.remove('seleccionada');
    carta2.src = "img/contra.png";
    aciertosSeguidos = 0;
    intentos++;
  } else if (cartasMezcladas[carta1.id] === cartasMezcladas[carta2.id]) {
    carta1.classList.add('resuelta');
    carta2.classList.add('resuelta');
    aciertosSeguidos++;
    if (aciertosSeguidos > 1) {
      intentos--;
    }
  } cartasBloqueadas = false;
  document.getElementById("Intentos").innerText = intentos;
}

inicarJuego();
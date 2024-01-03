const audio = document.getElementById("miMusica");
const input = document.getElementById("audioFile");
const playButton = document.getElementById("playButton");
const rewindButton = document.getElementById("rewindButton");
const forwardButton = document.getElementById("forwardButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const textContainer = document.querySelector('.text-container');
const audioProgress = document.getElementById("audioProgress");
const range = document.getElementById("rangoxd");
const volDisplay = document.getElementById("volDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const durationDisplay = document.getElementById("durationDisplay");
const scrollText = document.querySelector('.scroll-text');
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close-button");
const songList = document.getElementById("song-list");

const files = [];
let currentSongIndex = 0;

// Helper function for creating an element with attributes
function createElementWithAttributes(tag, attributes) {
  const element = document.createElement(tag);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

// Helper function for setting the source of an image element
function setImageSource(imgElement, src) {
  imgElement.setAttribute("src", src);
}

// Play audio
function playAudio() {
  audio.play();
  setImageSource(playImg, "img/pause.svg");
}

const playImg = createElementWithAttributes("img", { "src": "img/Play.svg" });
playButton.appendChild(playImg);

if (scrollText.textContent.trim() === '') {
  scrollText.innerHTML = 'FranxX';
  const img = createElementWithAttributes("img", { "src": "img/Yosumi.png", "class": "dimension" });
  scrollText.appendChild(img);
}

// Event listener for opening the modal
textContainer.addEventListener("click", () => {
  const display = files.length === 0 ? "block" : "none";
  document.getElementById("alertaError").style.display = display;
  document.querySelector(".msjerror").style.display = display;
});

textContainer.addEventListener("click", () => modal.style.display = "block");
closeButton.addEventListener("click", () => modal.style.display = "none");

// Function to load an audio file
function loadAudioFile(index) {
  if (index >= files.length) {
    return;
  }

  const file = files[index];
  const objectUrl = URL.createObjectURL(file);

  audio.src = objectUrl;

  setImageSource(playImg, "img/Play.svg");
  document.getElementById("TYL_NOMBRE").innerHTML = file.name;
}

function createSongList() {
  songList.innerHTML = "";
  files.forEach((file, i) => {
    const li = createElementWithAttributes("li", {});
    li.innerHTML = `<p>${file.name}</p>`;
    li.addEventListener("click", () => {
      currentSongIndex = i;
      loadAudioFile(currentSongIndex);
      modal.style.display = "none";
      playAudio();
    });
    songList.appendChild(li);

    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const sec = Math.floor(audio.duration % 60);
      let segundos = (sec < 9) ? `0${sec}` : sec;
      li.innerHTML += `<p>Duracion: ${minutes}:${segundos}</p>`;
    });
  });
}

audio.addEventListener("ended", function () {
  currentSongIndex = (currentSongIndex + 1) % files.length;
  if (currentSongIndex < files.length) {
    loadAudioFile(currentSongIndex);
    playAudio();
  } else {
    audio.pause();
    currentSongIndex = 0; // Reinicia la lista
  }
});

playButton.addEventListener("click", function () {
  if (audio.paused) {
    playAudio();
    if (scrollText.scrollWidth > textContainer.clientWidth) {
      scrollText.style.animation = 'scroll 15s linear infinite';
    } else {
      scrollText.style.removeProperty("animation");
    }
  } else {
    audio.pause();
    setImageSource(playImg, "img/Play.svg");
  }
});

rewindButton.addEventListener("click", function () {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardButton.addEventListener("click", function () {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});

prevButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex - 1 + files.length) % files.length;
  loadAudioFile(currentSongIndex);
});

nextButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex + 1) % files.length;
  loadAudioFile(currentSongIndex);
});

const bucleButton = document.getElementById("bucle");
let isLooping = false;

// Agregar una imagen al botón
const iconImg = document.createElement("img");
iconImg.setAttribute("src", "img/norepite.svg");
bucleButton.appendChild(iconImg);

bucleButton.addEventListener("click", function () {
  isLooping = !isLooping;
  if (isLooping) {
    audio.loop = true;
    setImageSource(iconImg, "img/sirepite.svg");
  } else {
    audio.loop = false;
    setImageSource(iconImg, "img/norepite.svg");
  }
});

audioProgress.addEventListener("click", function (e) {
  const progressWidth = this.offsetWidth;
  const clickedOffsetX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickedOffsetX / progressWidth) * duration;
});

audio.addEventListener("timeupdate", function () {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progress = (currentTime / duration) * 100;
  audioProgress.value = progress;

  const minutes = Math.floor(currentTime / 60);
  let seconds = Math.floor(currentTime - minutes * 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timeDisplay.innerHTML = `${minutes}:${seconds}`;

  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration - durationMinutes * 60);
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }
  durationDisplay.innerHTML = `${durationMinutes}:${durationSeconds}`;

  if (seconds % durationMinutes === 0) {
    document.getElementById("divisor").style.color = "green";
    document.getElementById("TYL_NOMBRE").style.color = "blue";
    if (audio.paused) {
      document.getElementById("divisor").style.color = "#a30071d4";
      document.getElementById("TYL_NOMBRE").style.color = "#a30071d4";
    }
  } else {
    document.getElementById("divisor").style.color = "#a30071d4";
    document.getElementById("TYL_NOMBRE").style.color = "#a30071d4";
  }

  if (durationMinutes === 0 || durationMinutes === 1) {
    const checkValue = seconds % 2 === 0;
    document.getElementById("divisor").style.color = checkValue ? "green" : "#a30071d4";
    document.getElementById("TYL_NOMBRE").style.color = checkValue ? "blue" : "#a30071d4";
  }
});

input.addEventListener("change", function () {
  files.length = 0;
  files.push(...this.files);
  createSongList();
  loadAudioFile(0);
  playAudio();
});

const adjustVolume = (value) => {
  audio.volume = value / 100;
  volDisplay.innerHTML = value;
  window.innerWidth > 600 ? volDisplay.classList.toggle("osiperri", value <= 30) : null;
};
range.oninput = () => adjustVolume(range.value);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight - 93.1;

canvas.width = canvasWidth;
canvas.height = canvasHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const initAnalyser = async (audio) => {
  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 256;
  return analyser;
};

const onChange = async (event) => {
  const analyser = await initAnalyser(audio);
  drawAudio(analyser);
};

input.onchange = onChange;

const drawAudio = (analyser) => {
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  requestAnimationFrame(() => drawAudio(analyser));
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength * 2); // Multiplica por 2 la cantidad de barras
  const barWidth = WIDTH / (bufferLength); // Ajusta el ancho de las barras según la nueva cantidad
  let x = 0;
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  dataArray.forEach((decibel, index) => {
    const c = index / (bufferLength * 2); // Ajusta la escala de colores según la nueva cantidad de barras
    const r = decibel + 25 * c;
    const g = 250 * c;
    const b = decibel * 3.5;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - decibel * 1.85, barWidth, decibel * 1.85); // Divide la altura de las barras a la mitad
    x += barWidth + 2;
  });
};
window.addEventListener("resize", () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight - vent;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  drawAudio(analyser);
});

var userAgent = navigator.userAgent;
var esDispositivoMovil = /Mobile/.test(userAgent) || /Android/.test(userAgent);
var vent;
var estiloMovil = `
.head .text-container {
  background-color: transparent;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.scroll-text {
    font-size: 9rem;
    position: absolute;
    white-space: nowrap;
    background-color: transparent;
    color: #a30071d4;
    font-family: "BloodBlocks", sans-serif;
}

.dimension {
  width: 150px;
  height: auto;
  transform: translateY(25px);
}

progress {
  width: 100%;
  height: 25px;
  accent-color: rgba(214, 9, 221, 0.842);
  opacity: 0.6;
}
  .cntrl {
    display: flex;
    justify-content: space-between;
    padding: 0px 10px 10px 10px;
    background-color: rgba(0, 0, 0, 0.85);
    flex-direction: column;
}

  .cntrls {
    margin-top: 10px;
    display: flex;
    justify-content: space-evenly;
    padding: 5px;
    border-radius: 15px;
    background-color: #5c0596;
}

label img, button img {
  height: auto;
  width: 150px;
}

.size {
  font-family: monospace;
  font-size: 4rem;
}

  .left,
  .right {
    margin: 0;
    text-align: center;
}

  .right {
    order: -1;
    transform: translateY(10px);
}

  .left {
    transform: translateY(-10px);
    margin-left: 10px;
}

  #volDisplay {
    margin-left: 80%;
}

input[type='range'] {
  display: block;
  width: 250px;
  transform: translateY(-20px);
}

input[type=range]::-webkit-slider-runnable-track {
  background-color: #0a159d;
  height: 15px;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  outline: none;
}

input[type=range]::-moz-range-track {
  background-color: #0a159d;
  height: 15px;
}

input[type=range]::-ms-track {
  background-color: #0a159d;
  height: 15px;
}

input[type=range]::-webkit-slider-thumb {
  background-color: #760553;
  width: 50px;
  height: 50px;
  border: 3px solid #333;
  border-radius: 25%;
  margin-top: -16px;
}

.modal-container {
  display: flex;
  flex-direction: column;
  width: 850px;
  height: 850px;
  background-color: #000000c7;
  border-radius: 50px;
  box-shadow: 0px 2px 20px 1px rgb(2, 70, 196);
}

.close {
  position: absolute;
  left: -70px;
  top: -160px;
  font-size: 14rem;
  cursor: pointer;
  rotate: 31deg;
  z-index: 510;
}

li p {
  margin: 0;
  padding: 10px 10px;
  width: 304px;
  background-color: #4b0247ad;
  border: 2px solid #063a87;
  font-family: sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  color: rgb(11, 141, 180);
  border-radius: 20px;
}

#alertaError {
  display: flex;
  position: relative;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px; /* Duplica el ancho actual */
  height: auto; /* Calcula automáticamente la altura para mantener la proporción */
  font-size: 14px; /* Ajusta el tamaño de fuente si es necesario */
  color: #e207b3;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
}

.msjerror {
  font-family: "BloodBlocks", sans-serif;
  font-size: 5rem;
  transform: scale(1.6);
}
`;

var estiloDesktop = `
.head .text-container {
  background-color: transparent;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.scroll-text {
    font-size: 5rem;
    position: absolute;
    white-space: nowrap;
    background-color: transparent;
    color: #a30071d4;
    font-family: "BloodBlocks", sans-serif;
  }
  
.dimension {
  width: 60px;
  height: auto;
}

label img {
    height: auto;
    width: 70px;
  }

progress {
    width: 100%;
    height: 10px;
    accent-color: rgba(214, 9, 221, 0.842);
    opacity: 0.6;
  }

.cntrl {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.85);
  }

.cntrls {
    padding: 5px;
    border-radius: 15px;
    background-color: #5c0596;
  }

  
button img {
  height: auto;
  width: 60px;
}

.size {
  font-family: monospace;
  font-size: 2rem;
}
  
.left {
    margin-left: 10px;
  }
  
.right {
    margin-right: 10px;
    transform: translateY(10px);
  }

  input[type='range'] {
    display: block;
    width: 200px;
  }

  input[type=range]::-webkit-slider-runnable-track {
    background-color: #0a159d;
    height: 5px;
  }
  
  input[type=range]:focus::-webkit-slider-runnable-track {
    outline: none;
  }
  
  input[type=range]::-moz-range-track {
    background-color: #0a159d;
    height: 3px;
  }
  
  input[type=range]::-ms-track {
    background-color: #0a159d;
    height: 3px;
  }

  input[type=range]::-webkit-slider-thumb {
    background-color: #760553;
    width: 30px;
    height: 30px;
    border: 3px solid #333;
    border-radius: 25%;
    margin-top: -13px;
  }

.modal-container {
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 500px;
    background-color: #000000c7;
    border-radius: 10px;
    box-shadow: 0px 2px 20px 1px rgb(2, 70, 196);
  }

  .close {
    position: absolute;
    left: -23px;
    top: -53px;
    font-size: 5rem;
    cursor: pointer;
    rotate: 25deg;
    z-index: 510;
  }

  li p {
    margin: 0;
    padding: 5px 10px;
    width: 130px;
    background-color: #4b0247ad;
    border: 2px solid #063a87;
    font-family: sans-serif;
    font-size: 0.96rem;
    font-weight: 600;
    text-align: center;
    color: rgb(11, 141, 180);
    border-radius: 5px;
  }

  #alertaError {
    display: flex;
    position: relative;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    font-size: 7px;
    color: #e207b3;
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
  }

.msjerror {
    font-family: "BloodBlocks", sans-serif;
    font-size: 3.5rem;
    transform: scale(1.6);
  }
`;

var styleElement = document.createElement("style");
styleElement.type = "text/css";

if (esDispositivoMovil) {
  styleElement.appendChild(document.createTextNode(estiloMovil));
  vent = 348;
} else {
  styleElement.appendChild(document.createTextNode(estiloDesktop));
  vent = 93.1;
}
document.head.appendChild(styleElement);

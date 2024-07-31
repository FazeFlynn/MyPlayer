// const { ipcRenderer } = require('electron');

const panelLeft = document.getElementById('left-panel');
const mainContainer = document.getElementById('main-container');

const topStrip = document.getElementById('top-strip');
const spanTitle = document.getElementById('title-span');
const pTitle = document.getElementById('title-p');
const controlBox = document.getElementById('controls-box');
const overlay = document.getElementById('overlay');

const player = document.getElementById('video-player');
const myPlayer = document.getElementById('player');
const videoTitle = document.getElementById('video-title');
const videoFolder = document.getElementById('folder-name');

const seekOuter = document.getElementById('seek-outer');
const seekInner = document.getElementById('seek-inner');

const videoPlayer = document.getElementById('video-player');
const playPauseButton = document.getElementById('play-pause');
const playPauseImg = document.getElementById('play-pause-img');
const muteUnmuteImg = document.getElementById('mute-unmute-img');
const fullScreenImg = document.getElementById('full-screen-img');

const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const muteUnmuteButton = document.getElementById('mute-unmute');
const fullscreenButton = document.getElementById('full-screen');

const speedInd = document.getElementById('ind-p');
const Ind = document.getElementById('ind');
let videoQueue = [];

document.addEventListener('keydown', (event) => {
  if (event.key == ' ') {
    PlayPause();      
  }
});

// overlay.addEventListener('click', PlayPause);

function PlayPause(){
  if (videoPlayer.paused || videoPlayer.ended) {
    videoPlayer.play();
    playPauseImg.src = "images/pause.png"
  } else {
    videoPlayer.pause();
    playPauseImg.src = "images/play.png"
    
  }
}

playPauseButton.addEventListener('click', () => {
  PlayPause();
});



seekOuter.addEventListener('click', (event) => {  
  const clickX = event.clientX - seekOuter.getBoundingClientRect().left;

  const innerWidth = (clickX / seekOuter.offsetWidth) * 100;        
  seekInner.style.width = `${innerWidth}%`;

  videoPlayer.removeEventListener('timeupdate', handleTimeUpdate);

  setCurrTime();  
});

seekOuter.addEventListener('mousemove', (event) => {  
  const clickX = event.clientX - seekOuter.getBoundingClientRect().left;

  const innerWidth = (clickX / seekOuter.offsetWidth) * 100;
  let playTimeTotal = videoPlayer.duration;
  let disCurr = (innerWidth*playTimeTotal)/100;
  speedInd.textContent = "Seeking : " + formatTime(disCurr);
  showSpeedInd();  

});

let currentTime;

videoPlayer.addEventListener('timeupdate',handleTimeUpdate);

function handleTimeUpdate(){
  currentTime = videoPlayer.currentTime;
  const duration = videoPlayer.duration;
  let barProgress = (currentTime/duration)*100;
  seekInner.style.width = `${barProgress}%`;
  currentTimeDisplay.textContent = formatTime(currentTime);
  durationDisplay.textContent = formatTime(duration);
}


function setCurrTime(){
  
  const computedStyles = window.getComputedStyle(seekInner);
  const computedStyles1 = window.getComputedStyle(seekOuter);
  const widthInner = (computedStyles.getPropertyValue('width'));
  const widthOuter = (computedStyles1.getPropertyValue('width'));
  let widthInP = (parseFloat(widthInner)/parseFloat(widthOuter))*100;
  const totalTime = videoPlayer.duration;
  videoPlayer.removeEventListener('timeupdate', handleTimeUpdate);
  videoPlayer.currentTime = ( (widthInP).toFixed(2) / 100) * totalTime;

  videoPlayer.addEventListener('timeupdate', handleTimeUpdate);
  
}


document.addEventListener('keydown', (event) => {
  if (event.key == 'm') {
    vidMute();      
  }
});


function vidMute(){
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    muteUnmuteImg.src = "images/volumeOn.png";
    speedInd.textContent = "Volume : " + (videoPlayer.volume*100).toFixed(0) + "%";
    showSpeedInd();

  } else {
    videoPlayer.muted = true;
    muteUnmuteImg.src = "images/volumeOff.png";
    speedInd.textContent = "Muted";
    showSpeedInd();

    
  }
}


muteUnmuteButton.addEventListener('click', () => {
  vidMute();
});

function normalPlayer(){

  fullScreenImg.src = "images/fullscreenEnter.png";

  topStrip.style.display = "flex";

  spanTitle.style.display = "none";
  videoPlayer.style.borderRadius = "10px";

  mainContainer.removeChild(myPlayer);
  let firstChildLeft = panelLeft.firstElementChild;
  panelLeft.insertBefore(myPlayer,firstChildLeft);

  mainContainer.style.display = "flex";
  mainContainer.style.justifyContent = "space-evenly";
  mainContainer.style.marginTop = "30px";

  myPlayer.style.height = "auto";

  document.body.style.scrollbarWidth = "auto";
  document.style.overflow = "";
  document.body.style.overflow = "";

}

let clearSTInd;

function showSpeedInd(){
  speedInd.style.opacity = "90%";

  if(clearSTInd){
    clearTimeout(clearSTInd)
  }

  clearSTInd = setTimeout(() => {
    speedInd.style.opacity = "0%";
  }, 1000);
}

let clearST;

function showControls(){
  spanTitle.style.opacity = "100%";
  controlBox.style.opacity = "100%";

  if(clearST){
    clearTimeout(clearST);
  }

  clearST = setTimeout(() => {
    spanTitle.style.opacity = "0%"; 
    controlBox.style.opacity = "0%";
  }, 1500);
}

function overControlBox(){
  if(clearST){
    clearTimeout(clearST);
  }
  controlBox.style.opacity = "100%";
  spanTitle.style.opacity = "100%";
}

controlBox.addEventListener('click',overControlBox);


overlay.addEventListener('mousemove', (event) => {
  const rect = controlBox.getBoundingClientRect();
  const isOverControlBox = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
  );

  if (isOverControlBox) {
      overControlBox();
  } else {
      showControls();
  }
});

function FullPlayer() {

  topStrip.style.display = "none";

  videoPlayer.style.borderRadius = "0px";

  panelLeft.removeChild(myPlayer);
  let firstChildMain = mainContainer.firstElementChild;
  mainContainer.insertBefore(myPlayer, firstChildMain);

  mainContainer.style.display = "block";
  mainContainer.style.justifyContent = "";
  mainContainer.style.marginTop = "0px";
  // myPlayer.style.position = "relative";
  myPlayer.style.top = "0%";
  myPlayer.style.height = "100vh";

  spanTitle.style.display = "block";

  fullScreenImg.src = "images/fullscreenExit.png"
  

}

document.addEventListener('keydown', (event) => {
  if (event.key == 'f') {
    FScreen();      
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key == ' ') {
    event.preventDefault();
    showControls();  
  }
});


function FScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen({ navigationUI: 'show' }); // Enable browser's user interface elements
      FullPlayer();

    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      normalPlayer();
    }
  }
}

fullscreenButton.addEventListener('click', () => {
  FScreen();
});

overlay.addEventListener('dblclick', (event) => {
  event.preventDefault();
  FScreen();
});


function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


document.addEventListener('dragover', (event) => {
    event.preventDefault();
    // myPlayer.classList.add('visible');
});

document.addEventListener('dragleave', (event) => {
    // myPlayer.classList.remove('visible');
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('video/'));
    if (files.length > 0) {
        videoQueue = files;
        playNextVideo();
    }
});

player.addEventListener('ended', playNextVideo);

function playNextVideo() {
    if (videoQueue.length > 0) {
        const nextVideo = videoQueue.shift();
        const videoURL = URL.createObjectURL(nextVideo);
        player.src = videoURL;
        player.play();
        videoTitle.textContent = nextVideo.name; // Update the video title
        pTitle.textContent = nextVideo.name; // Update the video title
        videoFolder.textContent = nextVideo.path;
    } else {
        videoTitle.textContent = 'No video playing';
    }
}

function getImmediateFolderName(filePath) {
    const dirPath = path.dirname(filePath);
    const folderName = path.basename(dirPath);
    return folderName;
}

let fDec = 10;
let clearSTFdec;

function skipVideoB() {
  if (videoPlayer) {

    if(clearSTFinc){
      clearTimeout(clearSTFdec);
    }

    videoPlayer.currentTime -= 10;
    speedInd.textContent = "-" + fDec + " seconds";
    fDec+=10;
    showSpeedInd();

    clearSTFdec = setTimeout(() => {
      fDec = 10;      
    },1000);
  }
}

let fInc = 10;
let clearSTFinc;

function skipVideoF() {
  if (videoPlayer) {

      if(clearSTFinc){
        clearTimeout(clearSTFinc);
      }

      videoPlayer.currentTime += 10;
      speedInd.textContent = "+" + fInc + " seconds";
      fInc+=10;
      showSpeedInd();

      clearSTFinc = setTimeout(() => {
        fInc = 10;        
      },1000);

  }
}

document.addEventListener('keydown', (event) => {
  if(event.key == 'ArrowLeft'){
    skipVideoB();
    showControls();

  }
});

document.addEventListener('keydown', (event) => {
  if(event.key == 'ArrowRight'){
    skipVideoF();
    showControls();
  }
});

function volumeUp() {
  if (videoPlayer && videoPlayer.volume <= 0.95) {
      videoPlayer.volume += 0.05;
      speedInd.textContent = ((videoPlayer.volume)*100).toFixed(0) + "%";
      showSpeedInd();
    } else {
      speedInd.textContent = "100%";
      showSpeedInd();
    }
}

function VolumeDown() {
  if (videoPlayer && videoPlayer.volume >= 0.05) {
      videoPlayer.volume -= 0.05;
      speedInd.textContent = ((videoPlayer.volume)*100).toFixed(0) + "%";
      showSpeedInd();
    } else {
      speedInd.textContent = "5%";
      showSpeedInd();
    }
}

document.addEventListener('keydown', (event) => {
  if(event.key == 'ArrowUp'){
    event.preventDefault();
    volumeUp();
  }
});

document.addEventListener('keydown', (event) => {
  if(event.key == 'ArrowDown'){
    event.preventDefault();
    VolumeDown();
  }
});

// ========================================================

document.addEventListener("keydown", function (event) {
  if (event.key == "s" && player.playbackRate < 10 && !(event.key == ' ')) {
    event.preventDefault();
    player.playbackRate +=0.25; 
    speedInd.textContent = (player.playbackRate).toFixed(2) + "x"; 
    showSpeedInd();

  }
});


document.addEventListener("keydown", function (event) {
  if (event.key == "a" && player.playbackRate > 0.25 && !(event.key == ' ')) {
    event.preventDefault();
    player.playbackRate -=0.25; 
    speedInd.textContent = (player.playbackRate).toFixed(2) + "x";  
    showSpeedInd();      
  }
});


document.addEventListener("keydown", function (event) {
  if (event.key == "d" && !(event.key == ' ')) {
    event.preventDefault();
    player.playbackRate = 1;
    speedInd.textContent = (player.playbackRate).toFixed(2) + "x";
    showSpeedInd();
       
  }
});

let saturation = 100;
let contrast = 100;
let brightness = 100;


document.addEventListener("keydown", function (event) {
  if (event.key == "q") {
    event.preventDefault(); 
    saturationD();        
  }
});

function saturationD() {
  if(saturation >= 10){
    saturation -= 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Saturation : ' + (saturation/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Saturation : 0.0';
    showSpeedInd();
  }
}


document.addEventListener("keydown", function (event) {
  if (event.key == "w") {
    event.preventDefault();
    saturationI();

    // saturation += 10;
    // updateFilters(); 
    // // addPadding();
    // speedInd.textContent = 'Saturation : ' + (saturation/100).toFixed(1);
    // showSpeedInd();          
  }
});

function saturationI() {
  if(saturation < 200){
    saturation += 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Saturation : ' + (saturation/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Saturation : 2.0';
    showSpeedInd();
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key == "e") {
    event.preventDefault();
    contrastD();

    // contrast -= 10;
    // updateFilters(); 
    // // addPadding();
    // speedInd.textContent = 'Contrast : ' + (contrast/100).toFixed(1);
    // showSpeedInd();          
  }
});

function contrastD() {
  if(contrast > 50){
    contrast -= 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Contrast : ' + (contrast/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Contrast : 0.5';
    showSpeedInd();
  }
}

function contrastI() {
  if(contrast < 150){
    contrast += 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Contrast : ' + (contrast/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Contrast : 1.5';
    showSpeedInd();
  }
}


document.addEventListener("keydown", function (event) {
  if (event.key == "r") {
    event.preventDefault();
    contrastI();

    // contrast += 10;
    // updateFilters(); 
    // // addPadding();
    // speedInd.textContent = 'Contrast : ' + (contrast/100).toFixed(1);
    // showSpeedInd();          
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key == "o") {
    event.preventDefault();
    brightnessD();

    // brightness -= 10;
    // updateFilters(); 
    // // addPadding();
    // speedInd.textContent = 'Brightness : ' + (brightness/100).toFixed(1);
    // showSpeedInd();          
  }
});

function brightnessI() {
  if(brightness < 150){
    brightness += 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Brightness : ' + (brightness/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Brightness : 1.5';
    showSpeedInd();
  }
}

function brightnessD() {
  if(brightness > 50){
    brightness -= 10;
    updateFilters(); 
    // addPadding();
    speedInd.textContent = 'Brightness : ' + (brightness/100).toFixed(1);
    showSpeedInd();
  } else {
    speedInd.textContent = 'Brightness : 0.5';
    showSpeedInd();
  }
}


document.addEventListener("keydown", function (event) {
  if (event.key == "p") {
    event.preventDefault();
    brightnessI();

    // brightness += 10;
    // updateFilters(); 
    // // addPadding();
    // speedInd.textContent = 'Brightness : ' + (brightness/100).toFixed(1);
    // showSpeedInd();          
  }
});


document.addEventListener("keydown", function (event) {
  if (event.key == "v") {
    player.style.filter = 'saturate(100%) contrast(100%) brightness(100%)';
    saturation = contrast = brightness = 100;

    speedInd.textContent = 'Filters Cleared';
    showSpeedInd(); 
  }
});


let currFilter = "invert(0)";

document.addEventListener("keydown", function (event) {
  if (event.key == "x") {
    event.preventDefault();
    if(currFilter == "invert(0)"){
      currFilter = "invert(1)";
      updateFilters();
      speedInd.textContent = 'Invert on';
      showSpeedInd();
    } else {
        currFilter = "invert(0)";
        updateFilters();
        speedInd.textContent = 'Invert off';
        showSpeedInd();      
    }
  }
});

function updateFilters() {
  if (currFilter == "invert(1)"){
    player.style.filter = `saturate(${saturation}%) contrast(${contrast}%) brightness(${brightness}%) invert(100%)`;
  } else {
    player.style.filter = `saturate(${saturation}%) contrast(${contrast}%) brightness(${brightness}%)`;
  }
}


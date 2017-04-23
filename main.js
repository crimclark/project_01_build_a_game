const $gameBoard = document.querySelector('#container');
const $red = document.querySelector('.red');
const $blue = document.querySelector('.blue');
const $yellow = document.querySelector('.yellow');
const $green = document.querySelector('.green');
const $score = document.querySelector('#score');
const $startBtn = document.querySelector('#start');
const winLoseMessage = document.querySelector('#win-lose');
const $playback = document.querySelector('#playback');
let speed = 500;
let gameActive;
let buzzerTime;
let lastSequence = [];
let userValues = [];
let colorSequence = [];
let sequenceLength = 1;

const colors = [
  {
    color: 'blue',
    node: $blue,
    pitch: 110
  },
  {
    color: 'yellow',
    node: $yellow,
    pitch: 138.59
  },
  {
    color: 'green',
    node: $green,
    pitch: 164.81
  },
  {
    color: 'red',
    node: $red,
    pitch: 220
  }
];

const soundParams = {
  sustain: 0.05,
  release: 0.08
}

const introId = setTimeout(intro, 100);

//push user click to userValues array
var userInput = function(event) {
  // prevents selecting space outside of color and ensures user has clicked start
  if (event.target.className && gameActive) {
    userValues.push(event.target.className);
    var index = userValues.length - 1;
    if (userValues[index] !== colorSequence[index]) {
      buzzerTime = setTimeout(buzzer, 200);
      winLoseMessage.innerHTML = 'You Lose!';
      // $startBtn.addEventListener('click', startSequence);
      gameActive = false;
      // window.addEventListener('keydown', enterStart);
      return;
    }
    // if arrays are the same length
    if (userValues.length === colorSequence.length) {
      //if last values are equal
      if (userValues[index] === colorSequence[index]) {
        $score.innerHTML = sequenceLength;
        if ($score.innerHTML === '20') {
          winLoseMessage.innerHTML = 'You win!';
          $startBtn.innerHTML = 'RETRY';
          return;
        }
        sequenceLength += 1;
        colorSequence = [];
        lastSequence = [];
        userValues = [];
        speed -= 20;
        startSequence();
        //set gameActive to false so userInput is not counted until next sequence is complete
        gameActive = false;
      }
    }
  }
};

function findIndex(color) {
  return colors.findIndex( el => el.color === color );
}

var keyInput = function(event) {
  const { keyCode } = event;

  // if (keyCode === 13) {
  //   return;
  // }

  if (keyCode !== 13) {
    let i;
    switch(keyCode) {
      // case 13:
      //   startSequence();
      //   clearGame();
      //   return;
      case 38:
        event = {target: $green};
        i = findIndex('green');
        break;
      case 39:
        event = {target: $red};
        i = findIndex('red');
        break;
      case 40:
        event = {target: $blue};
        i = findIndex('blue');
        break;
      case 37:
        event = {target: $yellow};
        i = findIndex('yellow');
        break;
      default:
        return;
    }
    userInput(event);
    flash(colors[i]);
  }
}

function flash(colorObj, octave = 1) {
  const { color, pitch, node } = colorObj;
  let flashClass = `${color}-flash`;
  node.classList.add(flashClass);
  console.log(colorObj)
  play(pitch * octave);
  setTimeout( () => {
    node.classList.remove(flashClass);
  }, 150);
};

// if first sequence, start immediately, else delay next turn by 1 sec
var startSequence = function() {
  setGameActive();
  // $startBtn.removeEventListener('click', startSequence);
  sequenceLength === 1 ? playSequence() : setTimeout(playSequence, 1000);
};

function setGameActive() {
  gameActive = true;
  // $gameBoard.addEventListener('click', userInput);
}

var enterStart = function(event) {
  if (event.keyCode === 13) {
    startSequence();
    // window.removeEventListener('keydown', enterStart);
    clearGame();
  }
};

function playSequence() {
  //disable reset button while sequence is playing
  // window.removeEventListener('keydown', enterStart);
  // window.removeEventListener('click', userInput);
  removeEventListeners();
  // $startBtn.setAttribute('disabled', 'true');
  // $playback.setAttribute('disabled', 'true');
  gameActive = false;
  var i = 0;
  var intervalId = setInterval( () => {
    var randomColor = getRandomColor();
    flash(randomColor);
    i++;
    //pushes sequence to array
    colorSequence.push(randomColor.color);
    //pushes object to store last sequence
    lastSequence.push(randomColor);
    if (i === sequenceLength) {
      clearTimeout(intervalId);
      // $startBtn.removeAttribute('disabled');
      // $playback.removeAttribute('disabled');
      // window.addEventListener('keydown', enterStart);
      addEventListeners();
      gameActive = true;
    }
  }, speed);
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function clearGame() {
  lastSequence = [];
  sequenceLength = 1;
  userValues = [];
  colorSequence = [];
  winLoseMessage.innerHTML = '';
  $score.innerHTML = '';
  $startBtn.innerHTML = 'RESTART';
  speed = 500;
  return;
}

function sounds(event) {
  clearTimeout(buzzerTime);
  const { classList } = event.target;
  let i;
  if ( classList.contains('red') ) i = findIndex('red');
  else if ( classList.contains('yellow') ) i = findIndex('yellow');
  else if ( classList.contains('green') ) i = findIndex('green');
  else if ( classList.contains('blue') ) i = findIndex('blue');
  if (i >= 0) play(colors[i].pitch);
};

function playBack(event) {
  // window.removeEventListener('keydown', enterStart);
  // window.removeEventListener('keydown', keyInput);
  removeEventListeners();
  // $startBtn.setAttribute('disabled', 'true');
  let i = 0;
  // $playback.setAttribute('disabled', 'true');
  const playBackInterval = setInterval( () => {
    flash(lastSequence[i]);
    i++;
    if (i === lastSequence.length) {
      clearInterval(playBackInterval);
      // window.addEventListener('keydown', enterStart);
      // window.addEventListener('keydown', keyInput);
      addEventListeners();
      // $startBtn.removeAttribute('disabled');
      // $playback.removeAttribute('disabled');
    }
  }, speed);
}

function addEventListeners() {
  window.addEventListener('keydown', enterStart);
  window.addEventListener('keydown', keyInput);
  $gameBoard.addEventListener('click', userInput);
  $gameBoard.addEventListener('click', sounds);
  $startBtn.addEventListener('click', startSequence);
  $playback.addEventListener('click', playBack);
  $startBtn.addEventListener('click', clearGame);
}

function removeEventListeners() {
  window.removeEventListener('keydown', enterStart);
  window.removeEventListener('keydown', keyInput);
  $gameBoard.removeEventListener('click', userInput);
  $gameBoard.removeEventListener('click', sounds);
  $startBtn.removeEventListener('click', startSequence);
  $playback.removeEventListener('click', playBack);
  $startBtn.removeEventListener('click', clearGame);
}

function intro() {
  // disableActions();
  let i = 0;
  let loops = 0;
  sustain = 0.05;
  release = 0.08;
  const introSequence = setInterval( () => {
    flash(colors[i], 2);
    i++;
    if (i === colors.length) {
      i = 0;
      loops++;
    }
    switch(loops) {
      case 12:
        sustain = 0.1;
        release = 0.2;
        break;
      case 13:
        clearInterval(introSequence);
        clearTimeout(introId);
        addEventListeners();
        // window.addEventListener('keydown', enterStart);
        // window.addEventListener('keydown', keyInput);
        // gameActive = true;
        // $startBtn.removeAttribute('disabled');
        break;
    }
  }, 75);
}

// function disableActions() {
//   $playback.setAttribute('disabled', 'true');
//   $startBtn.setAttribute('disabled', 'true');
// }

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var sustain = null;
var release = null;

function play(pitch) {
  var oscillator = audioContext.createOscillator();
  var oscFilter = audioContext.createBiquadFilter();
  var input = audioContext.createGain();
  oscillator.connect(oscFilter);
  oscFilter.connect(input);
  oscFilter.frequency.value = 1500;
  var feedback = audioContext.createGain();
  var delay = audioContext.createDelay();
  var filter = audioContext.createBiquadFilter();
  filter.frequency.value = 1000;
  var output = audioContext.createGain();
  output.connect(audioContext.destination);
  delay.delayTime.value = 0.3;
  feedback.gain.value = 0.65;
  input.gain.value = 0.4;
  input.connect(output);
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(filter);
  filter.connect(delay);
  var delayGain = audioContext.createGain();
  delayGain.gain.value = 0.2;
  delay.connect(delayGain);
  delayGain.connect(output);
  oscillator.frequency.value = pitch;
  var startTime = audioContext.currentTime;
  var endTime = startTime + sustain;
  input.gain.setTargetAtTime(0, endTime, release);
  oscillator.start(startTime);
  oscillator.stop(endTime + 4);
}

function buzzer() {
  var gainNode = audioContext.createGain();
  var oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 45;
  oscillator.type = 'square';
  gainNode.gain.value = 0.22;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  var startTime = audioContext.currentTime;
  var endTime = startTime + 0.6;
  gainNode.gain.setTargetAtTime(0, endTime, 0.01);
  oscillator.start(startTime);
  oscillator.stop(endTime + 1);
}


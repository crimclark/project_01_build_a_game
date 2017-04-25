'use strict';

var $gameBoard = document.querySelector('#container');
var $red = document.querySelector('.red');
var $blue = document.querySelector('.blue');
var $yellow = document.querySelector('.yellow');
var $green = document.querySelector('.green');
var $score = document.querySelector('#score');
var $startBtn = document.querySelector('#start');
var winLoseMessage = document.querySelector('#win-lose');
var $playback = document.querySelector('#playback');

var speed = 500;
var gameActive = void 0;
var userValues = [];
var colorSequence = [];
var sequenceLength = 1;

var colors = [{
  color: 'blue',
  node: $blue,
  pitch: 110
}, {
  color: 'yellow',
  node: $yellow,
  pitch: 138.59
}, {
  color: 'green',
  node: $green,
  pitch: 164.81
}, {
  color: 'red',
  node: $red,
  pitch: 220
}];

setTimeout(intro, 100);

function intro() {
  var i = 0;
  var loops = 0;
  var introSequence = setInterval(function () {
    flash(colors[i], 2);
    i++;
    if (i === colors.length) {
      i = 0;
      loops++;
    }
    switch (loops) {
      case 12:
        soundState.sustain = 0.1;
        soundState.release = 0.2;
        break;
      case 13:
        clearInterval(introSequence);
        return addEventListeners();
    }
  }, 75);
}

function gameLost() {
  setTimeout(buzzer, 200);
  winLoseMessage.innerHTML = 'You Lose!';
  return gameActive = false;
}

function gameWon() {
  $score.innerHTML = sequenceLength;
  winLoseMessage.innerHTML = 'You Win!';
  $startBtn.innerHTML = 'RETRY';
  return gameActive = false;
}

function lengthsAreEqual(userArr, compArr) {
  return userArr.length === compArr.length;
}

function nextTurn() {
  $score.innerHTML = sequenceLength;
  sequenceLength += 1;
  userValues = [];
  speed -= 20;
  return startSequence();
}

function userInput(_ref) {
  var color = _ref.color;

  var equalLengths = lengthsAreEqual.bind(null, userValues, colorSequence);
  if (gameActive) {
    userValues.push(color);
    var i = userValues.length - 1;
    if (userValues[i] !== colorSequence[i]) return gameLost();else if (equalLengths() && sequenceLength === 20) return gameWon();else if (equalLengths()) return nextTurn();
  }
}

function findIndex(color) {
  return colors.findIndex(function (el) {
    return el.color === color;
  });
}

function flash(colorObj) {
  var octave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var color = colorObj.color,
      pitch = colorObj.pitch,
      node = colorObj.node;

  var flashClass = color + '-flash';
  node.classList.add(flashClass);
  play(pitch * octave);
  setTimeout(function () {
    node.classList.remove(flashClass);
  }, 150);
}

// if first sequence, start immediately, else delay next turn by 1 sec
function startSequence() {
  return sequenceLength === 1 ? incrementSequence() : setTimeout(incrementSequence, 1000);
}

var handleStart = function handleStart(_ref2) {
  var keyCode = _ref2.keyCode,
      type = _ref2.type;

  if (keyCode === 13 || type === 'click') {
    initGame();
    return startSequence();
  }
};

function handlePlayback() {
  if (!colorSequence.length) return;
  return previousSequence(function (intervalId) {
    clearInterval(intervalId);
  });
}

function incrementSequence() {
  previousSequence(function (intervalId) {
    var randomColor = getRandomColor();
    flash(randomColor);
    clearInterval(intervalId);
    return colorSequence.push(randomColor.color);
  });
}

function previousSequence(callback) {
  removeEventListeners();
  var i = 0;
  var intervalId = setInterval(function () {
    if (i !== colorSequence.length) {
      var colorIndex = findIndex(colorSequence[i]);
      flash(colors[colorIndex]);
      i++;
    } else {
      callback(intervalId);
      addEventListeners();
    }
  }, speed);
}

function getRandomColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function initGame() {
  gameActive = true;
  sequenceLength = 1;
  userValues = [];
  colorSequence = [];
  winLoseMessage.innerHTML = '';
  $score.innerHTML = '';
  $startBtn.innerHTML = 'RESTART';
  return speed = 500;
}

function containsClass(classList, className) {
  return classList.contains(className);
}

function getColor(event) {
  var keyCode = event.keyCode;
  var classList = event.target.classList;

  var i = void 0;
  var containsColor = containsClass.bind(null, classList);
  if (keyCode === 37 || containsColor('yellow')) i = findIndex('yellow');else if (keyCode === 38 || containsColor('green')) i = findIndex('green');else if (keyCode === 39 || containsColor('red')) i = findIndex('red');else if (keyCode === 40 || containsColor('blue')) i = findIndex('blue');
  if (i > -1) return colors[i];
}

function handleMouseOrKey(event) {
  var color = getColor(event);
  if (color && gameActive) {
    userInput(color);
    flash(color);
  } else if (color) flash(color);
}

window.addEventListener('keydown', function (event) {
  if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) event.preventDefault();
});

function addEventListeners() {
  window.addEventListener('keydown', handleStart);
  $startBtn.addEventListener('click', handleStart);
  $gameBoard.addEventListener('mousedown', handleMouseOrKey);
  window.addEventListener('keydown', handleMouseOrKey);
  $playback.addEventListener('click', handlePlayback);
}

function removeEventListeners() {
  window.removeEventListener('keydown', handleStart);
  $startBtn.removeEventListener('click', handleStart);
  $gameBoard.removeEventListener('mousedown', handleMouseOrKey);
  window.removeEventListener('keydown', handleMouseOrKey);
  $playback.removeEventListener('click', handlePlayback);
}

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var soundState = {
  sustain: 0.05,
  release: 0.08
};

function play(pitch) {
  var sustain = soundState.sustain,
      release = soundState.release;

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
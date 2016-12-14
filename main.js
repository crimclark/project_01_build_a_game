var $gameBoard = document.querySelector('#container');
var $red = document.querySelector('.red');
var $blue = document.querySelector('.blue');
var $yellow = document.querySelector('.yellow');
var $green = document.querySelector('.green');
var $score = document.querySelector('#score');
var $startBtn = document.querySelector('#start');
var winLoseMessage = document.querySelector('#win-lose');
var speed = 500;
var gameActive = null;
var $playback = document.querySelector('#playback');

var lastSequence = [];

var colors = [
  {
    $color: $red,
    color: 'red',
    flashClass: 'red-flash'
  },
  {
    $color: $blue,
    color: 'blue',
    flashClass: 'blue-flash'
  },
  {
    $color: $yellow,
    color: 'yellow',
    flashClass: 'yellow-flash'
  },
  {
    $color: $green,
    color: 'green',
    flashClass: 'green-flash'
  }
]

var userValues = [];
var colorSequence = [];

var sequenceLength = 1; //store sequence length in variable. increase by 1 for each level

//push user click to userValues array
var userInput = function(event) {
  if (event.target.className && gameActive) { // prevents selecting space outside of color and ensures user has clicked start
    userValues.push(event.target.className);
    var currentIndex = userValues.length - 1;
    // console.log(currentIndex);
    if (userValues[currentIndex] !== colorSequence[currentIndex]) {
      // console.log('u lose');
      winLoseMessage.innerHTML = 'You Lose!';
      $startBtn.innerHTML = 'RETRY';
      return false;
    }
    if (userValues.length === colorSequence.length) { // if arrays are the same length
      if (userValues[currentIndex] === colorSequence[currentIndex]) { //if last values are equal
        // console.log('u win');
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
        speed -= 20; //sequence gets 20ms faster every turn
        // console.log(speed);
        startSequence();
      }
    }
  }
}

var flash = function($color, color){
  $color.classList.add(color.flashClass);

  if (color.flashClass === 'red-flash') {
    play(220, .2);
  }
  if (color.flashClass === 'yellow-flash') {
    play(138.59, .2);
  }
  if (color.flashClass === 'green-flash') {
    play(164.81, .2);
  }
  if (color.flashClass === 'blue-flash') {
    play(110, .2);
  }


  if($color.classList.contains(color.flashClass)) {
    var intervalId2 = setTimeout(function flashOff() {
      $color.classList.remove(color.flashClass);
    }, 100);
  }
}

var startSequence = function() {
  var turnDelay = setTimeout(function playSequence() { // pause after each turn
    gameActive = true;
    // clearGame();
    // winLoseMessage.innerHTML = '';
    var i = 0;
    intervalId = setInterval(function randomSequence() {
      var randomColor = getRandomColor();
      flash(randomColor.$color, randomColor);
      i++;
      colorSequence.push(randomColor.color); //pushes sequence to array
      lastSequence.push(randomColor); //pushes object to store last sequence
      console.log(lastSequence);
      if (i === sequenceLength) {
        clearTimeout(intervalId);
      }
    }, speed);
  }, 1000)
}
// return random color value from colors array
var getRandomColor = function() {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
   // console.log(colors[randomIndex]);
}

function clearGame() {
  sequenceLength = 1;
  userValues = [];
  colorSequence = [];
  winLoseMessage.innerHTML = '';
  $score.innerHTML = '';
  $startBtn.innerHTML = 'START';
  speed = 500;
  return;
}

function sounds(event) {
  if (event.target.classList.contains('red')) {
    play(220, .3);
  }
  if (event.target.classList.contains('yellow')) {
    play(138.59, .3);
  }
  if (event.target.classList.contains('green')) {
    play(164.81, .3);
  }
  if (event.target.classList.contains('blue')) {
    play(110, .3);
  }
}

function playBack(event) {
  var i = 0;
  var playBackInterval = setInterval(function playBackSequence() {
    flash(lastSequence[i].$color, lastSequence[i]);
    i++;
    if (i >= lastSequence.length) {
      clearInterval(playBackInterval);
    }
  }, speed)
  console.log(i);
}

$gameBoard.addEventListener('click', sounds);
$gameBoard.addEventListener('click', userInput);
$startBtn.addEventListener('click', startSequence);
$startBtn.addEventListener('click', clearGame);
$playback.addEventListener('click', playBack);

var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function play (pitch, duration) {
  var gainNode = audioContext.createGain();
  var oscillator = audioContext.createOscillator()
  gainNode.gain.value = .1;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination)
  oscillator.frequency.value = pitch
  var startTime = audioContext.currentTime
  var endTime = startTime + duration
  gainNode.gain.setTargetAtTime(0, endTime, .5)
  oscillator.start(startTime);
  oscillator.stop(endTime + 5);
}




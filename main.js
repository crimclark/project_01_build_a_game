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
var gameActive;
var buzzerTime;
var lastSequence = [];
var userValues = [];
var colorSequence = [];
var sequenceLength = 1;

var colors = [
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
  },
  {
    $color: $red,
    color: 'red',
    flashClass: 'red-flash'
  }
];

// var colors = [
//   {
//     color: 'blue',
//     node: $blue,
//     pitch: 110
//   },
//   {
//     color: 'yellow',
//     node: $yellow,
//     pitch: 138.59
//   },
//   {
//     color: 'green',
//     node: $green,
//     pitch: 164.81
//   },
//   {
//     color: 'red',
//     node: $red,
//     pitch: 220
//   }
// ];

var introId = setTimeout(intro, 100);

//push user click to userValues array
var userInput = function(event) {
  // prevents selecting space outside of color and ensures user has clicked start
  if (event.target.className && gameActive) {
    userValues.push(event.target.className);
    var index = userValues.length - 1;
    if (userValues[index] !== colorSequence[index]) {
      buzzerTime = setTimeout(buzzer, 200);
      winLoseMessage.innerHTML = 'You Lose!';
      $startBtn.addEventListener('click', startSequence);
      window.addEventListener('keydown', enterStart);
      // $startBtn.innerHTML = 'RETRY';
      gameActive = false;
      return false;
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

// var keyInput = function(event) {
//   if (gameActive) {
//     let i;
//     switch(event.keyCode) {
//       case 38:
//         event = {target: $green};
//         i = findIndex('green');
//         break;
//       case 39:
//         event = {target: $red};
//         i = findIndex('red');
//         break;
//       case 40:
//         event = {target: $blue};
//         i = findIndex('blue');
//         break;
//       case 37:
//         event = {target: $yellow};
//         i = findIndex('yellow');
//         break;
//     }
//     userInput(event);
//     flash(colors[i]);
//   }
// }

var keyInput = function(event) {
  if (gameActive) {
    switch(event.keyCode) {
      case 38:
        event = {target: $green};
        userInput(event);
        flash($green, colors[2], 1);
        break;
      case 39:
        event = {target: $red};
        userInput(event);
        flash($red, colors[3], 1);
        break;
      case 40:
        event = {target: $blue};
        userInput(event);
        flash($blue, colors[0], 1);
        break;
      case 37:
        event = {target: $yellow};
        userInput(event);
        flash($yellow, colors[1], 1);
        break;
    }
  }
}

// var flash = function($color, color, octave){
//   $color.classList.add(color.flashClass);

//   switch(color.flashClass) {
//     case 'red-flash':
//       play(220 * octave);
//       break;
//     case 'yellow-flash':
//       play(138.59 * octave);
//       break;
//     case 'green-flash':
//       play(164.81 * octave);
//       break;
//     case 'blue-flash':
//       play(110 * octave);
//       break;
//   }

//   if($color.classList.contains(color.flashClass)) {
//     setTimeout(function flashOff() {
//       $color.classList.remove(color.flashClass);
//     }, 150);
//   }
//   $startBtn.addEventListener('click', startSequence);
// };

var flash = function($color, color, octave){
  // pass in entire color object
  // const { color, pitch, node } = color

  let flashClass = `${color}-flash`;
  $color.classList.add(flashClass);

  switch(flashClass) {
    case 'red-flash':
      play(220 * octave);
      break;
    case 'yellow-flash':
      play(138.59 * octave);
      break;
    case 'green-flash':
      play(164.81 * octave);
      break;
    case 'blue-flash':
      play(110 * octave);
      break;
  }

  // refactor to pass in entire color object
  // remove switchstatement and instead
  // play(color.pitch);

  if($color.classList.contains(flashClass)) {
    setTimeout( () => {
      $color.classList.remove(flashClass);
    }, 150);
  }
  $startBtn.addEventListener('click', startSequence);
};

// if first sequence, start immediately, else delay next turn by 1 sec
var startSequence = function() {
  $startBtn.removeEventListener('click', startSequence);
  sequenceLength === 1 ? playSequence() : setTimeout(playSequence, 1000);
};

var enterStart = function(event) {
  if (event.keyCode === 13) {
    startSequence();
    window.removeEventListener('keydown', enterStart);
    clearGame();
  }
};

function playSequence() {
  //disable reset button while sequence is playing
  window.removeEventListener('keydown', enterStart);
  $startBtn.setAttribute('disabled', 'true');
  $playback.setAttribute('disabled', 'true');
  var i = 0;
  var intervalId = setInterval(function randomSequence() {
    var randomColor = getRandomColor();
    flash(randomColor.$color, randomColor, 1);
    i++;
    //pushes sequence to array
    colorSequence.push(randomColor.color);
    //pushes object to store last sequence
    lastSequence.push(randomColor);
    if (i === sequenceLength) {
      clearTimeout(intervalId);
      $startBtn.removeAttribute('disabled');
      $playback.removeAttribute('disabled');
      window.addEventListener('keydown', enterStart);
      gameActive = true;
    }
  }, speed);
}

var getRandomColor = function() {
  var randomIndex = Math.floor(Math.random() * colors.length);
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
  if (classList.contains('red')) {
    play(220);
  }
  if (classList.contains('yellow')) {
    play(138.59);
  }
  if (classList.contains('green')) {
    play(164.81);
  }
  if (classList.contains('blue')) {
    play(110);
  }
}

// function sounds(event) {
//   clearTimeout(buzzerTime);
//   const { classList } = event.target;
//   let i;
//   if ( classList.contains('red') ) i = findIndex('red');
//   else if ( classList.contains('yellow') ) i = findIndex('yellow');
//   else if ( classList.contains('green') ) i = findIndex('green');
//   else if ( classList.contains('blue') ) i = findIndex('blue');
//   play(colors[i].pitch);
// };

/**
  * Plays back last sequence
  * @param {MouseEvent}
  * Runs playBackSequence() at interval 'speed', which runs flash() with arguments from lastSequence.
*/
function playBack(event) {
  window.removeEventListener('keydown', enterStart);
  $startBtn.setAttribute('disabled', 'true');
  var i = 0;
  $playback.setAttribute('disabled', 'true');
  var playBackInterval = setInterval(function playBackSequence() {
    flash(lastSequence[i].$color, lastSequence[i], 1);
    i++;
    if (i === lastSequence.length) {
      clearInterval(playBackInterval);
      window.addEventListener('keydown', enterStart);
      $startBtn.removeAttribute('disabled');
      $playback.removeAttribute('disabled');
    }
  }, speed);
}

function intro() {
  disableActions();
  var i = 0;
  var loops = 0;
  sustain = 0.05;
  release = 0.08;
  var introSequence = setInterval( () => {
    flash(colors[i].$color, colors[i].color, 2);
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
        window.addEventListener('keydown', enterStart);
        $startBtn.removeAttribute('disabled');
        break;
    }
  }, 75);
}

// function intro() {
//   disableActions();
//   var i = 0;
//   var loops = 0;
//   sustain = 0.05;
//   release = 0.08;
//   var introSequence = setInterval( () => {
//     flash(colors[i].$color, colors[i], 2);
//     i++;
//     if (i === colors.length) {
//       i = 0;
//       loops++;
//     }
//     switch(loops) {
//       case 12:
//         sustain = 0.1;
//         release = 0.2;
//         break;
//       case 13:
//         clearInterval(introSequence);
//         clearTimeout(introId);
//         window.addEventListener('keydown', enterStart);
//         $startBtn.removeAttribute('disabled');
//         break;
//     }
//   }, 75);
// }

function disableActions() {
  $playback.setAttribute('disabled', 'true');
  $startBtn.setAttribute('disabled', 'true');
  window.removeEventListener('keydown', enterStart);
}

window.addEventListener('keydown', keyInput);
$gameBoard.addEventListener('click', sounds);
$gameBoard.addEventListener('click', userInput);
$startBtn.addEventListener('click', startSequence);
window.addEventListener('keydown', enterStart);
$startBtn.addEventListener('click', clearGame);
$playback.addEventListener('click', playBack);

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


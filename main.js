var $gameBoard = document.querySelector('#container');

var $red = document.querySelector('.red');
var $blue = document.querySelector('.blue');
var $yellow = document.querySelector('.yellow');
var $green = document.querySelector('.green');
var $score = document.querySelector('#score');

var $startBtn = document.querySelector('#start');
// var $quitBtn = document.querySelector('#quit');

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
  if (event.target.className) { // prevents selecting space outside of color
    userValues.push(event.target.className);
    var currentIndex = userValues.length - 1;
    console.log(currentIndex);
    if (userValues[currentIndex] !== colorSequence[currentIndex]) {
      console.log('u lose');
    }
    if (userValues.length === colorSequence.length) {
      if (userValues[currentIndex] === colorSequence[currentIndex]) {
        console.log('u win');
        $score.innerHTML = sequenceLength;
        sequenceLength += 1;
      }
    }
  }
}

var flash = function($color, color){
  $color.classList.add(color.flashClass);
  if($color.classList.contains(color.flashClass)) {
    var intervalId2 = setTimeout(function flashOff() {
      $color.classList.remove(color.flashClass);
    }, 100);
  }
}

var startSequence = function() {
  var i = 0;
  intervalId = setInterval(function randomSequence() {
    var randomColor = getRandomColor();
    flash(randomColor.$color, randomColor);
    i++;
    colorSequence.push(randomColor.color); //pushes sequence to array
    // console.log(colorSequence);
    if (i === sequenceLength) {
      clearTimeout(intervalId);
    }
  }, 500);
}

// return random color value from colors array
var getRandomColor = function() {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
   // console.log(colors[randomIndex]);
}


$gameBoard.addEventListener('click', userInput);
$startBtn.addEventListener('click', startSequence)









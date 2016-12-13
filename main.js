var $gameBoard = document.querySelector('#container');

var $red = document.querySelector('.red');
var $blue = document.querySelector('.blue');
var $yellow = document.querySelector('.yellow');
var $green = document.querySelector('.green');

var $startBtn = document.querySelector('#start');
var $quitBtn = document.querySelector('#quit');

var colors = ['green', 'red', 'yellow', 'blue'];

var red = {
  flashClass: 'red-flash'
}

var blue = {
  flashClass: 'blue-flash'
}

var yellow = {
  flashClass: 'yellow-flash'
}

var green = {
  flashClass: 'green-flash'
}


var userValues = [];
var colorSequence = [];

var sequenceLength = 1; //store sequence length in variable. increase by 1 for each level

//push user click to userValues array
var userInput = function(event) {
  if (event.target.className) { // prevents selecting space outside of color
    userValues.push(event.target.className);
    console.log(userValues);
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

var sequence = function() {
  flash($blue, blue);
  flash($red, red);
  flash($green, green);
  flash($yellow, yellow);
}


var startSequence = function() {
  var intervalId = setInterval(sequence, 500);
}

$gameBoard.addEventListener('click', userInput);
$startBtn.addEventListener('click', startSequence)

// return random color value from colors array
function getRandomColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}












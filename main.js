var $gameBoard = document.querySelector('#container');
var $red = document.querySelector('.red');
var $blue = document.querySelector('.blue');
var $yellow = document.querySelector('.yellow');
var $green = document.querySelector('.green');

var $startBtn = document.querySelector('#start');
var $quitBtn = document.querySelector('#quit');

var colors = ['green', 'red', 'yellow', 'blue'];

var userValues = [];
var colorSequence = [];

//push user click to userValues array
var userInput = function(event) {
  userValues.push(event.target.className);
  console.log(userValues);
}

var flash = function(){
  document.querySelector('.red').classList.toggle("red-flash");
  if(document.querySelector('.red').classList.contains('red-flash')) {
    var intervalId2 = setTimeout(function flashOff() {
      document.querySelector('.red').classList.remove("red-flash");
    }, 100);
  }
}

var startSequence = function() {
  var intervalId = setInterval(flash, 500);
}



// var stopSequence = function() {
//   clearInterval(intervalId);
// }


$gameBoard.addEventListener('click', userInput);
$startBtn.addEventListener('click', startSequence)





// return random color value from colors array
function getRandomColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

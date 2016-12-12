var $gameBoard = document.querySelector('#container');



var colors = ['green', 'red', 'yellow', 'blue'];
var userValues = [];


var userInput = function(event) {
  userValues.push(event.target.id);
  console.log(userValues);
}


$gameBoard.addEventListener('click', userInput);







// return random color value from colors array
function getRandomColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

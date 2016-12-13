MVP:

1. User clicks "start" button and computer plays sequence of colors, 
starting with 1 color lighting up and increasing by 1 each turn.

2. user clicks on each color in the same order. if user clicks same sequence
as computer, add 1 to users score and go to next turn.  
If user clicks wrong color, the game ends and they must click "Start" again
to start over.

3. if user finishes turn #20, display message "congratulations you won"

4. color sequence should be random order each turn

Bonus Feature requests:

-Play a different sound for each color
-allow user to use keyboard keys for each color instead of mouse click
-allow user to select difficulty level which can increase speed of computer sequence


HTML/CSS

1. create 4 divs - IDs: red, green, yellow, blue 
2. round border radius on one side of each div to create semi-circle
3. additional circle div in the center with "start" and "reset" button
4. create additional 4 IDs for each div with brighter colors. 
    - when a div is played back add and remove this ID in short time interval
    - set div:active to brighter color when user clicks it

JS Gameplay

set empty array to computer sequence
set empty array to user input
set variable sequence length to 0

store colors red, green, blue, and yellow in array
write function to get random color from colors array

sequence logic:

1. when user clicks "start" button, run function at one second interval 
that gets value from random color function and changes class for 
corresponding color div in the DOM. 

2. push each random color value to sequence array. 

3. when user clicks div, push color value to user array

4. if user clicked[i] !== computersequence[i], gameover
    else add 1 to score and add 1 to sequence length.

5. set computer sequence array and and user input array back to null















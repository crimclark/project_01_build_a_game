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



when each button plays in sequence, push color value to sequence array
when user clicks div, push color value to user array

add eventlistener to container div
colors.push(event.target.id);


if user clicked[i] !== computersequence[i], gameover
else add 1 to score and make sequence 1 longer





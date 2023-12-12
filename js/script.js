//TODO funktion för att display hela ordet när man vinner

// Globala variabler

const wordList = ["ELEPHANT", "SUNSHINE", "BUTTERFLY", "ADVENTURE", "BEAUTIFUL", "DELICIOUS", "SUNSHINE", "LAVENDER", "GARDENING", "ELEPHANT", "FANTASTIC", "ADVENTURE", "COLORFUL", "DREAMING", "HAPPINESS", "DELIGHTED", "ENERGETIC", "GRACEFUL", "BEAUTIFUL", "SENSITIVE", "LANDSCAPE", "BUTTERFLY", "CHARMING", "ALLIGATOR", "CHOCOLATE", "BRILLIANT", "ATTENTION", "FRAGRANCE", "IMPORTANT", "KNOWLEDGE"];

let gameWord;    // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan

let guesses = 0;   
let remainingLives = 6;
let hangmanImg = document.querySelector(`#hangman`);      // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl = document.querySelector('#message');     // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.querySelector('#startGameBtn');  // DOM-nod: knappen som du startar spelet med
let letterButtonEls = document.querySelector('#letterButtons');// Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls;    // Array av DOM-noder: Rutorna där bokstäverna ska stå
let restartBtn = document.querySelector('#restart');
let instructions = document.querySelector('#instructions');


startGameBtnEl.addEventListener('click', startGame);


//restarts game and resets buttons for letters.
restartBtn.addEventListener('click',restartGame);
restartBtn.addEventListener('click', resetButtons);

letterButtonEls.style.display = 'none';
msgHolderEl.style.display = 'none';

//When clicked, disable, returns value, 
letterButtonEls.addEventListener('click', disabled);
letterButtonEls.addEventListener('click', letterguess);




//Startar spelet med att välja ett element ur arrayen wordList och skapar boxes där ordet sedan ska visas när
//användaren gissar rätt.
function startGame(){
   generateGameplay();
   createLetterBoxes(gameWord);
   letterButtonEls.style.display = '';//Displays all letterbuttons.
   instructions.style.display = 'none'; 
   lives(instructions, remainingLives);
   document.body.style.backgroundColor = "#6a00ff";
}

function changeBackgroundColor() {
   document.getElementById("startGameBtn").style.backgroundColor = "lightblue";
}

// Funktion som slumpar fram ett ord
function generateGameplay(){
  gameWord = wordList[Math.floor(Math.random() * wordList.length)];
}
//create and displays the right amount of letterboxes for the randomized array
//hämtar rätt antal lådor för array value från UL
// Variabel i respektive letterbox baserat på length i gameWord
function createLetterBoxes(gameWord){
   letterBoxEls = document.querySelector('#letterBoxes > ul');
   for (let i = 0; i < gameWord.length; i++) {
      //console.log(gameWord[i]);
      let newLetterBox = document.createElement('li');
      let newLetterBoxInput = document.createElement('input');  
   
     
      const letter = gameWord[i];
      console.log(letter);

      newLetterBoxInput.setAttribute('disabled', true);
      letterBoxEls.appendChild(newLetterBox);
      newLetterBox.appendChild(newLetterBoxInput);
      startGameBtnEl.style.display = 'none';
   }

}

//Disable buttons
function disabled (event){
   event.target.disabled = true;
   console.log(event);
   console.log(event.target); 
   
}

let createLivesDisplay = document.createElement("div");
//skapar en bild som representerar spelarens liv (livesImg) i container createLivesDisplay

function lives(livesDisplay,remainingLives) {
createLivesDisplay.innerHTML = '';
   for (let i = 0; i < remainingLives; i++) {
   const livesImg = document.createElement("img");
   livesImg.src = "/images/pink-life-heart.webp";
   createLivesDisplay.appendChild(livesImg);
   Object.assign(livesImg.style,{
      width:"8vmin",
   });
}
livesDisplay.insertAdjacentElement("afterend", createLivesDisplay);
}



function letterguess(event) {
   const guessedLetter = event.target.value;
   const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
   let correctGuess = false;
   const clickedBtn = document.querySelector(`[value="${guessedLetter}"]`); //clickedBtn stylar knapparna post click
 
   for (let i = 0; i < gameWord.length; i++) {
     const letter = gameWord[i];

     if (guessedLetter === letter) {
       //Om spelaren gissar rätt
       console.log("Rätt gissat!" + guessedLetter);
       clickedBtn.style.border= "solid thin green";
       clickedBtn.style.color = "#61b568";
       letterBoxInputs[i].value = guessedLetter; //Show value letterbox
       correctGuess = true;
         gameWinner();
     }
   }

   if (!correctGuess) {
     console.log("fel gissat:" + guessedLetter);
      clickedBtn.style.border = "solid thin red";
      clickedBtn.style.color = "red";
      guesses++;
      remainingLives--; 
      console.log('lives left: ' + remainingLives);
      hangmanImg.src = `images/h${guesses}.png`; 
       lives(instructions, remainingLives);


    if (guesses >= 6) { // Check if guesses exceed the limit (6 in this case)
         gameOver();
     }
   }
}

   function gameOver() {
      let gameOverMsg = document.createElement("h2");
      gameOverMsg.setAttribute("id", "endGameMsg");
      msgHolderEl.appendChild(gameOverMsg);
      gameOverMsg.textContent = "Game Over, loser!!!";
      letterButtonEls.style.display = 'none';
      startGameBtnEl.style.display = 'none';
      instructions.style.display = 'none';
      msgHolderEl.style.display = '';
     revealWord();
     //TODO make a revealword function
      hangmanImg.src = 'images/h6.png'; 
      console.log("Game Over, loser!!!");//test
  }

  function revealWord() {
   const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
   for (let i = 0; i < gameWord.length; i++) {
       letterBoxInputs[i].value = gameWord[i];
   }
}

    function gameWinner() {
   const allInputs = document.querySelectorAll('#letterBoxes input');
   let guessedWord = '';
   allInputs.forEach(input=> {
      guessedWord += input.value;
   });
   if (guessedWord === gameWord) {
      let gameWinnerMsg = document.createElement("h2");
      gameWinnerMsg.setAttribute("id", "endGameMsg");
      msgHolderEl.appendChild(gameWinnerMsg);
      gameWinnerMsg.textContent = "Winner!!!";
      letterButtonEls.style.display = 'none';
      startGameBtnEl.style.display = 'none';
      instructions.style.display = 'none';
      msgHolderEl.style.display = '';
       console.log("WINNER!");//test
       
   }
}

/* function restart(){
   location.reload();
} */

function restartGame() {
   // Reset game variables /Reset Image /Show StartGameBtn /Show Instructions /Show letterbuttons
   guesses = 0;
   hangmanImg.src = 'images/h0.png'; 
   msgHolderEl.style.display = 'none'; 
   startGameBtnEl.style.display = ''; 
   instructions.style.display = ''; 
   letterButtonEls.style.display = '';

   // Remove old letter boxes
   const letterBoxesContainer = document.querySelector('#letterBoxes > ul');
   letterBoxesContainer.innerHTML = ''; // Clear content
   msgHolderEl.removeChild(document.getElementById("endGameMsg"));// removes message(h2-node) from msgholderEl from the DOM to clear for next game-round.
   // Generate a new word/create letterboxes/ reset Buttons
/*    generateGameplay();
   createLetterBoxes(gameWord); */
   startGame();
   resetButtons(); 
}


function resetButtons() {
   const letterButtons = document.querySelectorAll('#letterButtons button');
   letterButtons.forEach(button => {
      button.disabled = false;
      button.style.border = '';
      button.style.color = '';
      button.removeEventListener('click', letterguess);
   });
}
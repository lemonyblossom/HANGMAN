// Array with gameWords
const wordList = [
	"SUNSHINE",
	"BUTTERFLY",
	"ADVENTURE",
	"BEAUTIFUL",
	"DELICIOUS",
	"SUNSHINE",
	"LAVENDER",
	"GARDENING",
	"FANTASTIC",
	"ADVENTURE",
	"COLORFUL",
	"DREAMING",
	"HAPPINESS",
	"DELIGHTED",
	"ENERGETIC",
	"GRACEFUL",
	"BEAUTIFUL",
	"SENSITIVE",
	"LANDSCAPE",
	"BUTTERFLY",
	"CHARMING",
	"ALLIGATOR",
	"CHOCOLATE",
	"BRILLIANT",
	"ATTENTION",
	"FRAGRANCE",
	"IMPORTANT",
	"KNOWLEDGE",
	"MELLOW",
	"JACKET",
	"PUDDLE",
	"GUITAR",
	"BREEZE",
	"DINNER",
	"GLOVES",
	"FAMILY",
	"WIZARD",
	"FLIGHT",
	"SQUARE",
	"CARPET",
	"CIRCLE",
	"JUNGLE",
	"SPIRAL",
	"RATTLE",
	"MARBLE",
	"TENDER",
	"YELLOW",
	"WEATHER",
	"CLIMATE",
	"SUNRISE",
	"SUNSET",
	"RAINBOW",
	"CLOUDY",
	"BREEZY",
	"STORMY",
	"FREEZER",
	"HUMIDITY",
	"JAZZ",
	"PUZZLE",
	"QUIRK",
	"PIXEL",
	"POTION",
	"WIZARD",
	"RITUAL",
	"GALAXY",
	"VOODOO",
	"ZIGZAG",
];

// Globala variabler
let gameWord; // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan

let guesses = 0;
let remainingLives = 6;
let hangmanImg = document.querySelector(`#hangman`); // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`

let msgHolderEl = document.querySelector("#message"); // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.querySelector("#startGameBtn"); // DOM-nod: knappen som du startar spelet med
let letterButtonEls = document.querySelector("#letterButtons"); // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls = document.querySelector("#letterBoxes > ul"); // Array av DOM-noder: Rutorna där bokstäverna ska stå
let restartBtn = document.querySelector("#restart");
let instructions = document.querySelector("#instructions");
let gameBoard = document.querySelector("#gameBoard");
let createLivesDisplay = document.createElement("div");
let winnerBear = document.getElementById("winnerBear");

//eventlisteners
letterButtonEls.addEventListener("click", handleButtonClick);
startGameBtnEl.addEventListener("click", () => {
	setTimeout(() => {
		startGame();
	}, 400);
});
//for restart button
restartBtn.addEventListener("click", restartGame);

//button to restart
/* restartBtn.addEventListener('click', function() {
   restartGame();
   resetButtons();//problem! makes hearts decrease x2/x3/x4 after restart
   startGame();
 }); */

//How elements display when page is loaded.
letterButtonEls.style.display = "none";
msgHolderEl.style.display = "none";
gameBoard.display = "";
hangmanImg.style.display = "none";
winnerBear.style.display = "none";
gameBoard.style.visibility = "hidden";

//Todays date and time
const today = new Date();
const options = {
	weekday: "short",
	month: "short",
	day: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: false,
};
const todaysDate = today.toLocaleDateString("en-US", options);
document.getElementById("todaysDate").innerHTML = todaysDate;

// Starting the game by choosing an element from the array wordList and creating letterboxes where the word will be displayed later.
function startGame() {
	/* const letterButtonsContainer = document.getElementById('letterButtons');
   if (!letterButtonsContainer) {
      console.error('Element with ID "letterButtons" not found.');
      return;
   } */
	lives(gameBoard, remainingLives);
	animateLetterButtons();
	generateGameplay();
	createLetterBoxes(gameWord);
	letterButtonEls.style.display = "flex"; // Displays all letter buttons
	gameBoard.style.display = ""; // Displays the gameboard
	instructions.style.display = "none";
	hangmanImg.style.display = "";
	gameBoard.style.visibility = "visible";
	document.body.style.backgroundColor = "#6a00ff";

	console.log(gameWord);

	// Calls animateLetterButtons function to animate letterButtons
	animateLetterButtons();
}

//displays all letterbutton buttons one by one when startGame
function animateLetterButtons() {
	const letterButtonBtn = document.getElementById("letterButtons");
	if (!letterButtonBtn) {
		console.log("hittar inga letterbuttons");
		return;
	}

	const letterButtonsItem = letterButtonBtn.querySelectorAll("button");

	letterButtonsItem.forEach((item, i) => {
		setTimeout(() => {
			item.classList.add("show");
		}, i * 100); // time for delay 100ms
	});
}

/* function handleButtonClick(event) {
	disabled(event);
	letterguess(event);
} */ //trying out function below

function handleButtonClick(event) {
	const button = event.target.closest("button");
	if (button) {
		disabled(event);
		letterguess(event);
	}
}

// Picks a number randombly and forces it to an int and display the word from array =t o that int.
function generateGameplay() {
	gameWord = wordList[Math.floor(Math.random() * wordList.length)];
}

//create and displays the right amount of letterboxes for the gameWord
function createLetterBoxes(gameWord) {
	for (let i = 0; i < gameWord.length; i++) {
		let newLetterBox = document.createElement("li");
		let newLetterBoxInput = document.createElement("input");
		const letter = gameWord[i];
		console.log(letter);

		newLetterBoxInput.setAttribute("disabled", true);
		letterBoxEls.appendChild(newLetterBox);
		newLetterBox.appendChild(newLetterBoxInput);
		startGameBtnEl.style.display = "none";
	}
}

//Disable buttons
function disabled(event) {
	event.target.disabled = true;
	console.log(event);
	console.log(event.target);
}

function lives(livesDisplay, remainingLives) {
	// Clear existing content of livesDisplay div
	createLivesDisplay.innerHTML = "";

	// Create and append heart images for the amount of remainingLives
	for (let i = 0; i < remainingLives; i++) {
		const livesImg = document.createElement("img");
		livesImg.src = "/images/pink-heart.webp";
		createLivesDisplay.appendChild(livesImg);
		//Style
		Object.assign(livesImg.style, {
			width: "6vmin",
		});
	}
	// updates livesDisplay before (beforebegin) the og livesDisplay
	livesDisplay.insertAdjacentElement("beforebegin", createLivesDisplay);
}

function letterguess(event) {
	//gets guessed letter
	const guessedLetter = event.target.value;
	// Get all input elements within the letterBoxEls
	const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
	// tracks whether the guess was correct to the values in gameWord
	let correctGuess = false;
	// Get the button with the same value
	const clickedBtn = document.querySelector(`[value="${guessedLetter}"]`); //clickedBtn stylar knapparna post click

	//iterates through all the letters for GameWord
	for (let i = 0; i < gameWord.length; i++) {
		const letter = gameWord[i];

		//if gameWord contains the button value:
		if (guessedLetter === letter) {
			console.log("Rätt gissat!" + guessedLetter);

			//style
			clickedBtn.style.border = "solid thin green";
			clickedBtn.style.color = "#00ff77";

			//Display letter in letterBox
			letterBoxInputs[i].value = guessedLetter;
			correctGuess = true;

			//check if game is won
			gameWinner();
		}
	}

	// if gameWord does not contain the guessed letter
	if (!correctGuess) {
		console.log("fel gissat:" + guessedLetter);

		//style
		clickedBtn.style.border = "solid thin red";
		clickedBtn.style.color = "red";

		//update how many lives rremain
		guesses++;
		remainingLives--;
		console.log("lives left: " + remainingLives);
		console.log("wrong guesses:" + guesses);

		//update hangmanImg
		hangmanImg.src = `images/h${guesses}.png`;
		lives(gameBoard, remainingLives);

		//check if player is out of lives(guessed wrong 6 times), then over.
		if (guesses >= 6) {
			gameOver();
		}
	}
}

// runs when game over
function gameOver() {
	// creates message element for game over.
	let gameOverMsg = document.createElement("h2");
	gameOverMsg.setAttribute("id", "endGameMsg");
	msgHolderEl.appendChild(gameOverMsg);
	gameOverMsg.textContent = "Game Over, loser!!!";

	//hide elements that isnt used when game over.
	letterButtonEls.style.display = "none";
	startGameBtnEl.style.display = "none";
	instructions.style.display = "none";
	msgHolderEl.style.display = "";

	//reveal the full correct word when losing
	revealWord();

	//update img of hangedBear
	hangmanImg.src = "images/h6.png";
	console.log("Game Over, loser!!!"); //test
}
//reveal the full correct word when losing by getting all ctreated letterboxes inputs.
function revealWord() {
	const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
	for (let i = 0; i < gameWord.length; i++) {
		letterBoxInputs[i].value = gameWord[i];
	}
}

//runs when gameWinner (the player is winning)
function gameWinner() {
	const allInputs = document.querySelectorAll("#letterBoxes input");
	let guessedWord = "";
	allInputs.forEach((input) => {
		guessedWord += input.value;
	});

	//checks if the guessed word is the same as gameWord
	if (guessedWord === gameWord) {
		//hide the hangmanImg to make room for winnerBear image
		hangmanImg.style.display = "none";

		//displays winnerBear
		winnerBear.src = `images/winnerBear.png`;
		winnerBear.style.display = "";

		//create WinnerBear Image
		let gameWinnerMsg = document.createElement("h2");
		gameWinnerMsg.setAttribute("id", "endGameMsg");
		msgHolderEl.appendChild(gameWinnerMsg);
		gameWinnerMsg.textContent = "Congratulations! \n You won!!";

		//Hide the elements not useful on gameWinner
		letterButtonEls.style.display = "none";
		startGameBtnEl.style.display = "none";
		instructions.style.display = "none";
		msgHolderEl.style.display = "";

		console.log("WINNER!"); //test
	}
}

function restartGame() {
	// Reset game variables /Reset Image /Show StartGameBtn /Show Instructions /Show letterbuttons
	guesses = 0;
	hangmanImg.src = "images/h0.png";
	msgHolderEl.style.display = "none";
	startGameBtnEl.style.display = "";
	instructions.style.display = "";
	letterButtonEls.style.display = "";
	winnerBear.style.display = "none";
	remainingLives = 6;

	// Remove old letter boxes
	const letterBoxesContainer = document.querySelector("#letterBoxes > ul");
	letterBoxesContainer.innerHTML = ""; // Clear content
	msgHolderEl.removeChild(document.getElementById("endGameMsg")); // removes message(h2-node) from msgholderEl from the DOM to clear for next game-round.

	resetButtons();
	startGame();
}

//reseting buttons in game to be able play again.
/* function resetButtons() {
   console.log('Resetting buttons');
   const letterButtons = document.querySelectorAll('#letterButtons button');
  
   //remove listeners
   letterButtons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
   });
//add new listener
   letterButtons.forEach(button => {
      button.disabled = false;
      button.style.border = '';
      button.style.color = '';
      button.addEventListener('click', handleButtonClick);
   }); */
function resetButtons() {
	console.log("ResetButtons running");
	const letterButtons = document.querySelectorAll("#letterButtons button");

	letterButtons.forEach((button) => {
		// Remove existing event listeners
		button.removeEventListener("click", handleButtonClick);
		button.disabled = false;
		button.style.border = "";
		button.style.color = "";

		// Add a new event listener
		button.addEventListener("click", handleButtonClick);
	});
}

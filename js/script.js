//gameWords in  wordList in alphabetical order
const wordList = [
	"ADVENTURE",
	"ALLIGATOR",
	"ATTENTION",
	"BEAUTIFUL",
	"BRILLIANT",
	"BREEZE",
	"BUTTERFLY",
	"CARPET",
	"CHARMING",
	"CHOCOLATE",
	"CIRCLE",
	"CLIMATE",
	"CLOUDY",
	"COLORFUL",
	"DELICIOUS",
	"DELIGHTED",
	"DINNER",
	"DREAMING",
	"ENERGETIC",
	"FANTASTIC",
	"FLIGHT",
	"FREEZER",
	"FRAGRANCE",
	"GALAXY",
	"GARDENING",
	"GLOVES",
	"GRACEFUL",
	"HAPPINESS",
	"HUMIDITY",
	"IMPORTANT",
	"JACKET",
	"JAZZ",
	"JUNGLE",
	"KNOWLEDGE",
	"LANDSCAPE",
	"LAVENDER",
	"MARBLE",
	"MELLOW",
	"PIXEL",
	"PUDDLE",
	"PUZZLE",
	"POTION",
	"QUIRK",
	"RAINBOW",
	"RATTLE",
	"RITUAL",
	"SQUARE",
	"SPIRAL",
	"STORMY",
	"SUNSHINE",
	"VOODOO",
	"WEATHER",
	"WIZARD",
	"YELLOW",
	"ZIGZAG",
];

// Globala variabler
let createLivesDisplay = document.createElement("div");
let gameBoard = document.querySelector("#gameBoard");
let gameWord; // the chosen word for the player to guess
let guesses = 0;
let guessedWord = "";
let hangmanImg = document.querySelector(`#hangman`); // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`
let hasWon;
let instructions = document.querySelector("#instructions");
let letterBoxEls = document.querySelector("#letterBoxes > ul"); // Array av DOM-noder: Rutorna där bokstäverna ska stå
let letterButtonEls = document.querySelector("#letterButtons"); // Array av DOM-noder: Knapparna för bokstäverna
let msgHolderEl = document.querySelector("#message"); // DOM-nod: Ger meddelande när spelet är över
let remainingLives = 6;
let restartBtn = document.querySelector("#restart");
let startGameBtnEl = document.querySelector("#startGameBtn"); // DOM-nod: knappen som du startar spelet med
let winnerBear = document.getElementById("winnerBear");
let wins = 0;
let losses = 0;

// Event listener for startGame
startGameBtnEl.addEventListener("click", () => {
	setTimeout(() => {
		startGame();
	}, 400);
});

// Eventlistener on restart
restartBtn.addEventListener("click", function () {
	resetButtons();
	restartGame();
});

// Initial display
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
const formattedDate = today.toLocaleDateString("en-US", options);
document.getElementById("todaysDate").innerHTML = formattedDate;

// Starting the game by choosing an element from the array wordList and creating letterboxes where the word will be displayed on guessedLetter.
function startGame() {
	hasWon = false;
	clearEndGameMsg();
	animateLetterButtons();
	generateGameplay();
	createLetterBoxes(gameWord);
	letterButtonEls.style.display = "flex"; // Displays all letter buttons
	gameBoard.style.display = ""; // Displays the gameboard
	instructions.style.display = "none";
	hangmanImg.style.display = "";
	gameBoard.style.visibility = "visible";
	lives(gameBoard, remainingLives);
	document.body.style.backgroundColor = "#6a00ff";
	letterButtonEls.addEventListener("click", handleButtonClick);
	console.log(gameWord);
}

//displays all letterbutton buttons one by one when startGame
function animateLetterButtons() {
	const letterButtonBtn = document.getElementById("letterButtons");
	const letterButtonsItem = letterButtonBtn.querySelectorAll("button");

	letterButtonsItem.forEach((item, index) => {
		setTimeout(() => {
			item.classList.add("show");
		}, index * 100); // time for delay 100ms
	});
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

		newLetterBoxInput.setAttribute("disabled", true);
		letterBoxEls.appendChild(newLetterBox);
		newLetterBox.appendChild(newLetterBoxInput);
		startGameBtnEl.style.display = "none";
	}
}
//eventhandler for letterButtons
function handleButtonClick(event) {
	disabled(event);
	letterguess(event);
}
//Disable buttons
function disabled(event) {
	event.target.disabled = true;
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
			maxWidth: "80px",
			maxHeight: "80px",
		});
	}
	// updates livesDisplay before (beforebegin) the og livesDisplay
	livesDisplay.insertAdjacentElement("beforebegin", createLivesDisplay);
}

function letterguess(event) {
	//gets guessed letter
	const guessedLetter = event.target.value;
	// Get all input values in letterBoxEls
	const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
	let correctGuess = false;
	// Get the button with the same value
	const clickedBtn = document.querySelector(`[value="${guessedLetter}"]`); //clickedBtn stylar knapparna post click

	//iterates through all the letters in GameWord
	for (let i = 0; i < gameWord.length; i++) {
		const letter = gameWord[i];

		//if gameWord contains the button value:
		if (guessedLetter === letter) {
			console.log("Good guess: " + guessedLetter);
			//Display letter in letterBox
			letterBoxInputs[i].value = guessedLetter;
			correctGuess = true;
			//style
			clickedBtn.style.border = "0.4vmin outset #b293ff";
		}
	}

	// if gameWord does not contain the guessed letter
	if (!correctGuess) {
		console.log("Bad guess: " + guessedLetter);
		//style
		clickedBtn.style.border = "0.4vmin outset #ff0000";
		clickedBtn.style.color = "#ff0000";
		//update how many lives rremain
		guesses++;
		remainingLives--;
		console.log("lives: " + remainingLives);
		//update hangmanImg to match img to number of wrong guess
		hangmanImg.src = `images/h${guesses}.png`;
		lives(gameBoard, remainingLives);
	}

	//checks if the guessed word is the same as gameWord
	guessedWord = "";

	for (let i = 0; i < letterBoxInputs.length; i++) {
		guessedWord += letterBoxInputs[i].value;
	}

	if (guesses >= 6) {
		gameResult();
	} else if (guessedWord === gameWord) {
		hasWon = true;
		gameResult();
	}
}

//TODO function for counting wins and losses
//score for lost games
function displayLoseCount() {
	document.getElementById("loseCount").textContent = "Losses: " + losses;
}
//score for won games
function displayWinCount() {
	document.getElementById("winCount").textContent = "Wins: " + wins;
}

// runs when game done
function gameResult() {
	hide();
	//hide elements that isnt used when game over.
	letterButtonEls.style.display = "none";
	startGameBtnEl.style.display = "none";
	instructions.style.display = "none";
	msgHolderEl.style.display = "";

	if (hasWon) {
		wins++;
		displayWinCount();
		console.log("Game won!"); //test
		//create WinnerBear Image and message
		let gameWinnerMsg = document.createElement("h2");
		gameWinnerMsg.setAttribute("id", "endGameMsg");
		msgHolderEl.appendChild(gameWinnerMsg);
		gameWinnerMsg.textContent = "Congratulations! \n You won!!";
		//hide the hangmanImg to make room for winnerBear image
		hangmanImg.style.display = "none";
		//displays winnerBear
		winnerBear.src = `images/winnerBear.png`;
		winnerBear.style.display = "";

		// increments how many time the player has won
	} else {
		losses++;
		displayLoseCount();
		revealWord(); //reveal the full correct word when losing

		let gameOverMsg = document.createElement("h2");
		// creates message element for game over.
		gameOverMsg.setAttribute("id", "endGameMsg");
		msgHolderEl.appendChild(gameOverMsg);
		gameOverMsg.textContent = "Game Over, loser!!!";
		//update img of hangedBear
		hangmanImg.src = "images/h6.png";
		console.log("Game lost!"); //test
	}
}

//reveal the full correct word when losing by getting all ctreated letterboxes inputs.
function revealWord() {
	const letterBoxInputs = letterBoxEls.getElementsByTagName("input");
	for (let i = 0; i < gameWord.length; i++) {
		letterBoxInputs[i].value = gameWord[i];
	}
}
function hide() {
	//Hide the elements not useful on gameWinner
	letterButtonEls.style.display = "none";
	startGameBtnEl.style.display = "none";
	instructions.style.display = "none";
	msgHolderEl.style.display = "";
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
	startGame();
}

function clearEndGameMsg() {
	//removes endGameMsg if there
	const endGameMsg = document.getElementById("endGameMsg");
	if (endGameMsg) {
		endGameMsg.parentNode.removeChild(endGameMsg);
	}
	console.log("fetching message by id");
}

//reseting buttons in game to be able play again.
function resetButtons() {
	console.log("Resetting buttons");
	const letterButtons = document.querySelectorAll("#letterButtons button");
	letterButtons.forEach((button) => {
		button.disabled = false;
		button.style.border = "";
		button.style.color = "";
		button.removeEventListener("click", handleButtonClick);
	});
}

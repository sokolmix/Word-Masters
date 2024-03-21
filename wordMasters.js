const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
let winningWord;
let boxId = 1;
let lettersQuantity = 0;
let currentWord = "";
let inMemoryIndex = 1;
const spinnerDiv = document.querySelector('.spinner');

async function getWord() {
    const promise = await fetch(WORD_URL);
    const proceedResponse = await promise.json();
    winningWord = proceedResponse.word;
    console.log(winningWord);
    setSpinner(false);
}
getWord();

async function validateWord(word) {
    setSpinner(true);
    const promise = await fetch(VALIDATE_WORD_URL, {
        method: "POST",
        body: JSON.stringify({ "word": word })
    });

    const proceedResponse = await promise.json();
    const isValid = proceedResponse.validWord;
    setSpinner(false);
    return isValid;

}

document
    .addEventListener("keydown", function (event) {
        const key = event.key;
        if (!isLetter(key)) {
            if (key === "Enter") {
                if (lettersQuantity === 5) {
                    handleEnter();
                } else
                    event.preventDefault();
            } else if (key === "Backspace") {
                handleBackspace();
            } else
                event.preventDefault();
        } else {
            handleLetter(event.key);
        }

    });

function handleBackspace() {
    if (boxId > 1) {
        boxId--;
        const box = document.getElementById(`letter-${boxId}`);
        box.textContent = "";
        lettersQuantity--;
        currentWord = currentWord.slice(0, -1);
    }
}

function handleEnter() {
    validateWord(currentWord)
        .then(isValid => {
            if (!isValid)
                markOnRed();
            else {
                checkWord();
            }
        });

}

function checkWord() {
    if (winningWord === currentWord) {
        
        addWonClass();
        
    } else if (boxId === 31) {
        alert("You Lose :(");
    }

    checkLetters();

    currentWord = "";
    lettersQuantity = 0;
}
function checkLetters() {
    let winningWordCopy = winningWord;
    for (let i = 0; i < currentWord.length; i++) {
        changeBoxColor(i, 'grey');
        const currentLetter = currentWord[i];
        const winningLetter = winningWord[i];
        if (currentLetter === winningLetter) {
            changeBoxColor(i, 'green');
            winningWordCopy = sliceWinningWordCopy(winningWordCopy, currentLetter);
        }
    }

    for (let i = 0; i < currentWord.length; i++) {
        const currentLetter = currentWord[i];
        if (isLetterExist(currentLetter, winningWordCopy)) {
            changeBoxColor(i, '#daa520');
            winningWordCopy = sliceWinningWordCopy(winningWordCopy, currentLetter);
        }
    }
}

function sliceWinningWordCopy(winningWordCopy, currentLetter) {
    let indexToRemove = winningWordCopy.indexOf(currentLetter);
    return winningWordCopy.slice(0, indexToRemove) + winningWordCopy.slice(indexToRemove + 1);
}

function isLetterExist(letter, word) {
    return word.includes(letter);
}

function changeBoxColor(index, color) {
    const box = document.getElementById(`letter-${boxId - 5 + index}`);
    box.style.backgroundColor = color;
    box.style.color = 'white';
}

function markOnRed() {
    const invalidClass = 'invalid';
    let children = document.getElementById(`letter-${boxId - 1}`).parentElement.children;

    for (let i = 0; children.length > i; i++) {
        children[i].classList.add(invalidClass);

        setTimeout(function removeinvalid() {
            children[i].classList.remove(invalidClass);
        }, 1000);
    }
}

function handleLetter(letter) {
    if (lettersQuantity < 5) {
        const box = document.getElementById(`letter-${boxId}`);
        box.textContent = letter;

        currentWord += letter;
        boxId++;
        lettersQuantity++;
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setSpinner(isLoading) {
    spinnerDiv.classList.toggle('hidden', !isLoading);
}
function addWonClass() {
    document.querySelector('.game-name').classList.add('won');
}
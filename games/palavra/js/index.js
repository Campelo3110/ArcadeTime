const inputs = document.querySelector(".word"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess span"),
    mistakes = document.querySelector(".wrong span"),
    resetBtn = document.querySelector(".reset"),
    hintBtn = document.querySelector(".showhint"),
    hintElement = document.querySelector(".hint"),
    typeInput = document.querySelector(".type-input")

let word, incorrectLetters = [], correctLetters = [], maxGuesses

function startNewGame() {
    alert("Novo jogo iniciado! Adivinhe a nova palavra :)")
    hintElement.style.display = "none"
    hintElement.style.opacity = "0"

    const ranWord = wordList[Math.floor(Math.random() * wordList.length)]
    word = ranWord.word;
    maxGuesses = word.length >= 5 ? 8 : 6
    incorrectLetters = []
    correctLetters = []
    hintTag.innerText = ranWord.hint
    guessLeft.innerText = maxGuesses
    mistakes.innerText = incorrectLetters

    inputs.innerHTML = ""
    for (let i = 0; i < word.length; i++) {
        const input = document.createElement("input")
        input.type = "text"
        input.disabled = true
        inputs.appendChild(input)
    }
}

function handleInput(e) {

    const key = e.target.value.toLowerCase()
    if (key.match(/^[a-z]+$/i) && !incorrectLetters.includes(`${key}`) && !correctLetters.includes(`${key}`)) {
        
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    inputs.querySelectorAll("input")[i].value += key
                }
            }
            correctLetters += key
        } else {
            maxGuesses--
            incorrectLetters.push(`${key}`)
            mistakes.innerText = incorrectLetters
        }
    }


    guessLeft.innerText = maxGuesses;
    if (correctLetters.length === word.length) {
        alert(`Parabéns! Você encontrou a palavra ${word.toUpperCase()}`)
        startNewGame();
    } else if (maxGuesses < 1) {
        alert("Fim do jogo! Você não tem mais palpites!")
        for (let i = 0; i < word.length; i++) {
            inputs.querySelectorAll("input")[i].value = word[i]
        }
    }

    typeInput.value = ""
}

function showHintElement() {
    hintElement.style.display = "block"
    hintElement.style.opacity = "1"
}

resetBtn.addEventListener("click", startNewGame)
hintBtn.addEventListener("click", showHintElement)
typeInput.addEventListener("input", handleInput)
inputs.addEventListener("click", () => typeInput.focus())
document.addEventListener("keydown", () => typeInput.focus())

startNewGame()
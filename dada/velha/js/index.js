var playerTurn, moves, isGameOver, span, restartButton
let div = document.createElement("div")
playerTurn = "x"
moves = 0
isGameOver = false
span = document.getElementsByTagName("span")
restartButton = '<button onclick="playAgain()"><i class="ri-loop-left-line"></i></button>'

function play(y){
    if (y.dataset.player == "none" && window.isGameOver == false){
        y.innerHTML = playerTurn
        y.dataset.player = playerTurn
        moves++
        if (playerTurn == "x"){
            playerTurn = "o"
        }else if (playerTurn == "o"){
            playerTurn = "x"
        }
    }

     /* Tipos de vitórias */
     checkWinner(1, 2, 3);
     checkWinner(4, 5, 6);
     checkWinner(7, 8, 9);
     checkWinner(1, 4, 7);
     checkWinner(2, 5, 8);
     checkWinner(3, 6, 9);
     checkWinner(1, 5, 9);
     checkWinner(3, 5, 7);

     /* Sem vencedor */

     if (moves == 9 && isGameOver == false){draw();}
}

function checkWinner(a, b, c){
    a--
    b--
    c--
    if ((span[a].dataset.player === span[b].dataset.player) && (span[b].dataset.player === span[c].dataset.player) && (span[a].dataset.player === span[c].dataset.player) && (span[a].dataset.player === "x" || span[a].dataset.player === "o") && isGameOver == false){
        span[a].parentNode.classname += " activeBox"
        span[b].parentNode.classname += " activeBox"
        span[c].parentNode.classname += " activeBox"
        gameOver(a)
    }
}

function playAgain() {
    let alertBox = document.getElementsByClassName("alert")[0];
    if (alertBox) {
        alertBox.parentNode.removeChild(alertBox);
    }
    resetGame();
    window.isGameOver = false;
    for (let k = 0; k < span.length; k++) {
        span[k].parentNode.className = span[k].parentNode.className.replace("activeBox", "");
    }
    div.innerHTML = ""
}

function resetGame(){
    for (i = 0; i < span.length; i++){
        span[i].dataset.player = "none"
        span[i].innerHTML = "&nbsp"
    }
    playerTurn = "x"
}

function gameOver(a){
    let gameOverAlertElement = "<p>FIM DO JOGO </p><br><br> Jogador " + span[a].dataset.player.toUpperCase() + ' Ganhou !!! <br><br><br>' + restartButton
    div.className = "alert"
    div.innerHTML = gameOverAlertElement
    document.getElementsByTagName("body")[0].appendChild(div)
    window.isGameOver = true
    moves = 0
}

function draw(){
    let drawAlertElement = '<p>EMPATE!!!</p><br><br><br>' + restartButton
    div.className = "alert"
    div.innerHTML = drawAlertElement
    document.getElementsByTagName("body")[0].appendChild(div)
    window.isGameOver = true
    moves = 0
}
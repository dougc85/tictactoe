
const playerFirst = document.querySelector('.player-button');
const cpuFirst = document.querySelector('.cpu-button');

playerFirst.addEventListener('mousedown', () => {
    playerFirst.classList.toggle('button-push');
})
cpuFirst.addEventListener('mousedown', () => {
    cpuFirst.classList.toggle('button-push');
})
document.addEventListener('mouseup', () => {
    playerFirst.classList.remove('button-push');
})
document.addEventListener('mouseup', () => {
    cpuFirst.classList.remove('button-push');
})
playerFirst.addEventListener('click', () => {
    document.querySelector('.title-screen').classList.toggle('hide');
    document.querySelector('.game-board').classList.toggle('hide');
})
cpuFirst.addEventListener('click', () => {
    document.querySelector('.title-screen').classList.toggle('hide');
    document.querySelector('.game-board').classList.toggle('hide');
})



const playerFactory = (piece) => {
    return {piece};
}

const gameBoard = (() => {
    const blank = 0;
    let boardArray = [blank, blank, blank, blank, blank, blank, blank, blank, blank];
    return {boardArray};
})();

const gameControl = (() => {

    let playerX = playerFactory('X');
    let playerO = playerFactory('O');

    

    const play = function() {

    }

    return {play};
})();

gameControl.play();


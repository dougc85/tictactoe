


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


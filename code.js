

const blank = '';
let boardArray = [blank, blank, blank, blank, blank, blank, blank, blank, blank];

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const playerFactory = (name, piece) => {
    return {name, piece};
}

const gameBoard = (() => {
    
    let boardPositionArray = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

    const boardDiv = document.querySelector('.game-board');

    const renderBoard = function() {

        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.firstChild);
        };

        let counter = 0;
        boardArray.forEach((mark) => {
            const box = document.createElement('div');
            box.textContent = mark;
            box.classList.add(boardPositionArray[counter]);
            box.dataset.id = boardPositionArray[counter];
            box.classList.add('box');
            if (mark === '') {
                box.classList.add('empty-square');
            }
            counter++;
            boardDiv.appendChild(box);
        })
    }

    const checkEmpty = function(position) {
        return boardArray[position] === '';
    }

    const checkThreat = function(mark) {
        let zero = [boardArray[0], 0];
        let one = [boardArray[1], 1];
        let two = [boardArray[2], 2];
        let three = [boardArray[3], 3];
        let four = [boardArray[4], 4];
        let five = [boardArray[5], 5];
        let six = [boardArray[6], 6];
        let seven = [boardArray[7], 7];
        let eight = [boardArray[8], 8];

        let row0 = {zero, one, two};
        let row1 = {three, four, five};
        let row2 = {six, seven, eight};
        let col0 = {zero, three, six};
        let col1 = {one, four, seven};
        let col2 = {two, five, eight};
        let diSE = {zero, four, eight};
        let diNE = {six, four, two};

        let allGroups = [row0, row1, row2, col0, col1, col2, diSE, diNE];
        let allGroupsLength = allGroups.length;

        let threatObject;
        
        for (let i = 0; i < allGroupsLength; i++) {
            let group = allGroups[i];
            let threatLevel = Object.values(group).reduce((acc, squareArray) => {
                if (squareArray[0] == mark) {
                    return acc + 1;
                } else {
                    return acc;
                }
            }, 0);

            if (threatLevel == 2) {
                let position;

                let isThreatReal = false;

                for (const prop in group) {    
                    if (group[prop][0] == '') {
                        position = group[prop][1];
                        isThreatReal = true;
                    }
                }
                if (!isThreatReal) {
                    continue;
                } else {
                    threatObject = {
                    threat: true,
                    pos: position };
                
                    break;
                }
            }
        }

        if (threatObject) {
            return threatObject;
        } else {
            return {
                threat: false,
                pos: null,
            }
        }
    }

    const checkWin = function() {

        let zero = boardArray[0];
        let one = boardArray[1];
        let two = boardArray[2];
        let three = boardArray[3];
        let four = boardArray[4];
        let five = boardArray[5];
        let six = boardArray[6];
        let seven = boardArray[7];
        let eight = boardArray[8];

        if (zero == one && one == two && zero !== '') {
            return {win: true, winner: zero};
        } else if (three == four && four == five && three !== '') {
            return {win: true, winner: three};
        } else if (six == seven && seven == eight && six !== '') {
            return {win: true, winner: six};
        } else if (zero == three && three == six && zero !== '') {
            return {win: true, winner: zero};
        } else if (one == four && four == seven && one !== '') {
            return {win: true, winner: one};
        } else if (two == five && five == eight && two !== '') {
            return {win: true, winner: two};
        } else if (zero == four && four == eight && zero !== '') {
            return {win: true, winner: zero};
        } else if (two == four && four == six && two !== '') {
            return {win: true, winner: two};
        } else {
            for (let i = 0; i < boardArray.length; i++) {
                if (boardArray[i] == '') {
                    return {win: false, winner: ""};
                }
            }
            return {win: true, winner: "tie"}
        }
    };

    const fill = function(boxNumber, piece) {
        boardArray[boxNumber] = piece;
    }

    const clear = function() {
        boardArray = boardArray.map(() => blank);
    }
    return {boardPositionArray, renderBoard, checkEmpty, checkThreat, checkWin, fill, clear};
})();

const gameControl = (() => {

    let playerX;
    let playerO;

    const compareArrays = function(array1, array2) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    const play = function(firstPlayer, secondPlayer) {
        gameBoard.clear();
        gameBoard.renderBoard();

        let turn = 1;
        let playerPiece = 'X';
        let cpuPiece = 'O';

        if (firstPlayer.name == 'cpu') {
            playerPiece = 'O';
            cpuPiece = 'X';
            gameBoard.fill(4, cpuPiece);
            gameBoard.renderBoard();
            turn++;
        }

        const endGame = async function(winner) {

            await sleep(1700);
            let message = (winner === "tie") ? 'This was a TIE GAME' :
                          (winner === 'player') ? 'PLAYER WINS' : 'COMPUTER WINS';
                        
            document.querySelector('.end-screen').classList.toggle('hide');
            document.querySelector('.game-board').classList.toggle('hide');
            document.querySelector('.end-message').textContent = message;
           
        }

        async function makePlay(e) {
            let clickedBox = e.target;
            if (clickedBox.classList.contains('box') && clickedBox.classList.contains('empty-square')) {
                positionNumber = gameBoard.boardPositionArray.indexOf(clickedBox.dataset.id);
                gameBoard.fill(positionNumber, playerPiece);
                gameBoard.renderBoard();
                let winObject = gameBoard.checkWin();
                if (winObject.win) {
                    document.removeEventListener('click', makePlay);
                    endGame(winObject.winner);
                } else {
                    turn++;
                    await sleep(700);
                    let compMove = cpuMove(cpuPiece, playerPiece, turn)
                    turn++;
                    gameBoard.fill(compMove, cpuPiece);
                    gameBoard.renderBoard();
                    let winObject = gameBoard.checkWin();
                    if (winObject.win) {
                        let winner = (winObject.winner == 'tie') ? 'tie' :
                                     (winObject.winner == playerPiece) ? 'player' : 'computer';
                        document.removeEventListener('click', makePlay);
                        endGame(winner);
                    }
                }
            }
        }
        document.addEventListener('click', makePlay);
    }

    const cpuMove = function(cpuPiece, playerPiece, turn) {
        if (gameBoard.checkEmpty(4)) {
            return 4;
        }

        if (turn === 3) {
            if (compareArrays(boardArray, ['', playerPiece, '', '', cpuPiece, '', '', '', ''])) {
                return 2;
            }
            if (compareArrays(boardArray, ['', '', '', '', cpuPiece, playerPiece, '', '', ''])) {
                return 8;
            }
            if (compareArrays(boardArray, ['', '', '', '', cpuPiece, '', '', playerPiece, ''])) {
                return 6;
            }
            if (compareArrays(boardArray, ['', '', '', playerPiece, cpuPiece, '', '', '', ''])) {
                return 0;
            }
        }

        if (turn === 4) {
            //protect from corner trap
            if (compareArrays(boardArray, [playerPiece, '', '', '', cpuPiece, '', '', '', playerPiece])) {
                return 1;
            }
            if (compareArrays(boardArray, ['', '', playerPiece, '', cpuPiece, '', playerPiece, '', ''])) {
                return 1;
            }

            //protect from + trap
            if (compareArrays(boardArray, ['', playerPiece, '', '', cpuPiece, playerPiece, '', '', ''])) {
                return 2;
            }
            if (compareArrays(boardArray, ['', '', '', '', cpuPiece, playerPiece, '', playerPiece, ''])) {
                return 8;
            }
            if (compareArrays(boardArray, ['', '', '', playerPiece, cpuPiece, '', '', playerPiece, ''])) {
                return 6;
            }
            if (compareArrays(boardArray, ['', playerPiece, '', playerPiece, cpuPiece, '', '', '', ''])) {
                return 0;
            }
        }

        if (turn === 5) {
            if (compareArrays(boardArray, ['', playerPiece, cpuPiece, '', cpuPiece, '', playerPiece, '', ''])) {
                return 5;
            }
            if (compareArrays(boardArray, [playerPiece, '', '', '', cpuPiece, playerPiece, '', '', cpuPiece])) {
                return 7;
            }
            if (compareArrays(boardArray, ['', '', playerPiece, '', cpuPiece, '', cpuPiece, playerPiece, ''])) {
                return 3;
            }
            if (compareArrays(boardArray, [cpuPiece, '', '', playerPiece, cpuPiece, '', '', '', playerPiece])) {
                return 1;
            }
        }
        
        //Attempt win
        let goalObject = gameBoard.checkThreat(cpuPiece);
        if (goalObject.threat) {
            return goalObject.pos;
        }

        //Block player
        let threatObject = gameBoard.checkThreat(playerPiece);
        if (threatObject.threat) {
            return threatObject.pos;
        }

        // Fill Corners
        let cornersCurrent = [boardArray[0], boardArray[2], boardArray[6], boardArray[8]];
        let moveOptions = [0, 2, 6, 8];
        let moveChoice = [];

        for (let i = 0; i < cornersCurrent.length; i++) {
            if (cornersCurrent[i] === '') {
                moveChoice.push(moveOptions[i]);
            }
        }

        if (moveChoice.length > 0) {
            return moveChoice[Math.floor(Math.random() * moveChoice.length)];
        } else {
            return boardArray.indexOf('');
        }
    }

    const playerFirst = document.querySelector('.player-button');
    const cpuFirst = document.querySelector('.cpu-button');
    const resetButton = document.querySelector('.reset-button');

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
        playerX = playerFactory('player', 'X');
        playerO = playerFactory('cpu', 'O');
        play(playerX, playerO);
    })
    cpuFirst.addEventListener('click', () => {
        document.querySelector('.title-screen').classList.toggle('hide');
        document.querySelector('.game-board').classList.toggle('hide');
        playerX = playerFactory('cpu', 'X');
        playerO = playerFactory('player', 'O');
        play(playerX, playerO);
    })

    

    resetButton.addEventListener('mousedown', () => {
        resetButton.classList.toggle('button-push');
    })

    document.addEventListener('mouseup', () => {
        resetButton.classList.remove('button-push');
    })

    resetButton.addEventListener('click', () => {
        document.querySelector('.title-screen').classList.toggle('hide');
        document.querySelector('.end-screen').classList.toggle('hide');
    })

    return {};
})();

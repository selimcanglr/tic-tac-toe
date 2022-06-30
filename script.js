const CELL_NUMBER = 9;
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const player = (name, mark) => {
    let playerName = name
    let playerMark = mark

    return {
        get mark() {
            return playerMark
        },

        set mark(newMark) {
            playerMark = newMark
        },

        get name() {
            return playerName
        }
    }
};

const gameBoard = (() => {
    let board = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    ];

    const markCell = (location, mark) => {
        if (board[location] != undefined) {
            return false; // Already marked
        }

        board[location] = mark;
        return true;
    }

    const getMarker = (location) => {
        return board[location];
    }

    const resetBoard = () => {
        for (let i = 0; i < CELL_NUMBER; i++) {
            board[i] = undefined;
        }
    };

    const isFull = () => {
        return board.every(element => {
            return element != undefined;
        });
    };

    const getMarkerLocations = () => {
        let xLocations = [];
        let oLocations = [];
        for (let i = 0; i < CELL_NUMBER; i++) {
            if (board[i] == 'x') {
                xLocations.push(i);
            }
            else if (board[i] == 'o') {
                oLocations.push(i);
            }
        }

        return {xLocations, oLocations}
    };


    return {markCell, resetBoard, getMarker, getMarkerLocations, isFull};

})();

const gameController = (() => {
    let player1 = player('Player 1', 'x');
    let player2 = player('Player 2', 'o');
    let turnOfPlayer1 = true;
    
    const reset = () => {
        gameBoard.resetBoard();
    };

    const playNext = (location) => {
        let currentPlayer = turnOfPlayer1 ? player1 : player2;

        let isMarkingSuccessful = gameBoard.markCell(location, currentPlayer.mark);
        if (isMarkingSuccessful) {
            turnOfPlayer1 = !turnOfPlayer1;
        }
    }

    const getMarkerAtLocation = (location) => {
        return gameBoard.getMarker(location);
    }

    const checkWinner = () => {
        let markerLocations = gameBoard.getMarkerLocations();
        const xLocations = markerLocations.xLocations;
        const oLocations = markerLocations.oLocations;

        for (let combination of WINNING_COMBINATIONS) {
            const xWins = combination.every(element => {
                return xLocations.includes(element);     
            })
            if (xWins) {
                return 'x';
            }

            const yWins = combination.every(element => {
                return oLocations.includes(element);
            })
            if (yWins) {
                return 'o';
            }
        }

        if (gameBoard.isFull()) {
            return 'tie';
        }

        return undefined;
    };

    const changeMarker = () => {
        const temp = player1.mark
        player1.mark = player2.mark
        player2.mark = temp
        turnOfPlayer1 = true
    }

    return {reset, playNext, getMarkerAtLocation, checkWinner, changeMarker};
})();

const displayController = (() => {
    // Clicking marker change
    const xBtn = document.getElementById("xBtn")
    const oBtn = document.getElementById("oBtn")
    const restartBtn = document.querySelector("#restartButton");

    const renderGameBoard = () => {
        let cells = document.querySelectorAll(".cell");
        for (let i = 0; i < CELL_NUMBER; i++) {
            let currentMarker = gameController.getMarkerAtLocation(i);
            if (currentMarker) {
                cells[i].classList.add(currentMarker);
            }
        }
    };

    const changeMarker = (event) => {
        resetBoard()
        gameController.changeMarker()

        if (event.target.id == 'xBtn' && xBtn.classList.contains('selected-side') ||
            event.target.id == 'oBtn' && oBtn.classList.contains('selected-side') ) {
                return;
            }
        
        xBtn.classList.toggle('selected-side')
        oBtn.classList.toggle('selected-side')
    }

    const resetBoard = () => {
        let cells = document.querySelectorAll(".cell");
        gameController.reset();
        for (let i = 0; i < CELL_NUMBER; i++) {
            cells[i].classList.remove('x');
            cells[i].classList.remove('o');
        }
        
        let winningMsgDiv = document.querySelector(".winning-msg");
        winningMsgDiv.classList.remove("show");
    }

    const init = () => {
        // Clicking cells
        let cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                gameController.playNext(cell.id);
                renderGameBoard();

                let winner = gameController.checkWinner();

                if (winner) {
                    let msg = document.querySelector('.msg');
                    if (winner == 'tie') {
                        msg.textContent = 'It\'s a tie!';
                    }
                    else {
                        msg.textContent = `${winner} wins!`;
                    }

                    let winningMsgDiv = document.querySelector(".winning-msg");
                    winningMsgDiv.classList.add("show");
                }
            });
        });

        // Clicking restart button
        restartBtn.addEventListener('click', resetBoard);

        // Changing markers
        xBtn.addEventListener('click', changeMarker)
        oBtn.addEventListener('click', changeMarker)
    }


    return {init};
})();


displayController.init();
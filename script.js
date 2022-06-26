const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", ""];
    const addMark = (location, mark) => {
        board[location] = mark;
    };

    return {addMark};
})();

const Player = (name, mark, isTheirTurn) => {
    return {name, mark, isTheirTurn};
};

const displayController = (() => {

})();

displayController.init();
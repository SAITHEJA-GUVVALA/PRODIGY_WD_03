document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.querySelector('.status');
    const resetButton = document.getElementById('reset-btn');
    const twoPlayerButton = document.getElementById('two-player-btn');
    const aiPlayerButton = document.getElementById('ai-player-btn');

    let gameActive = false;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let againstAI = false;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

    twoPlayerButton.addEventListener('click', startTwoPlayerGame);
    aiPlayerButton.addEventListener('click', startAIGame);
    resetButton.addEventListener('click', resetGame);
    cells.forEach(cell => cell.addEventListener('click', cellClicked));

    function startTwoPlayerGame() {
        gameActive = true;
        againstAI = false;
        resetGameState();
        statusDisplay.innerHTML = currentPlayerTurn();
        resetButton.disabled = false;
        twoPlayerButton.disabled = true;
        aiPlayerButton.disabled = true;
    }

    function startAIGame() {
        gameActive = true;
        againstAI = true;
        resetGameState();
        statusDisplay.innerHTML = currentPlayerTurn();
        resetButton.disabled = false;
        twoPlayerButton.disabled = true;
        aiPlayerButton.disabled = true;
    }

    function resetGame() {
        gameActive = false;
        resetGameState();
        statusDisplay.innerHTML = 'Choose a game mode to start';
        resetButton.disabled = true;
        twoPlayerButton.disabled = false;
        aiPlayerButton.disabled = false;
    }

    function resetGameState() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x-marker', 'o-marker');
        });
    }

    function cellClicked(e) {
        if (!gameActive) return;
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        if (gameState[clickedCellIndex] !== '') return;
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
        if (gameActive && againstAI && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-marker' : 'o-marker');
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
            if (condition) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }

        changePlayer();
    }

    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    function makeAIMove() {
        const availableMoves = getAvailableMoves();
        if (availableMoves.length === 0) return;
        let bestMove = -1;

        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            gameState[move] = 'O';
            const isWinning = checkWinningMove('O');
            gameState[move] = '';
            if (isWinning) {
                bestMove = move;
                break;
            }
        }

        if (bestMove === -1) {
            for (let i = 0; i < availableMoves.length; i++) {
                const move = availableMoves[i];
                gameState[move] = 'X';
                const isWinning = checkWinningMove('X');
                gameState[move] = '';
                if (isWinning) {
                    bestMove = move;
                    break;
                }
            }
        }

        if (bestMove === -1 && availableMoves.includes(4)) {
            bestMove = 4;
        }

        if (bestMove === -1) {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            bestMove = availableMoves[randomIndex];
        }

        const cellToPlay = document.querySelector(`[data-index="${bestMove}"]`);
        handleCellPlayed(cellToPlay, bestMove);
        handleResultValidation();
    }

    function getAvailableMoves() {
        return gameState.map((val, idx) => val === '' ? idx : -1).filter(idx => idx !== -1);
    }

    function checkWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const conditionMet = gameState[a] === player && gameState[b] === player && gameState[c] === player;
            if (conditionMet) return true;
        }
        return false;
    }
});

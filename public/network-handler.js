// network-handler.js

function setupNetworkHandlers(socket, gameState, currentPlayer, highScores, updateUI) {
    socket.on('connect', () => {
        // Remove the showLoading call from here
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        updateUI.showDisconnected();
    });

    socket.on('gameConstants', (constants) => {
        updateUI.setGameConstants(constants);
    });

    socket.on('gameState', (newGameState) => {
        gameState = newGameState;
        const newCurrentPlayer = gameState.players[socket.id];
        if (newCurrentPlayer) {
            if (!currentPlayer) {
                currentPlayer = {};
            }
            currentPlayer.ethereumAddress = newCurrentPlayer.ethereumAddress;
        }
        updateUI.updateGame(gameState, newCurrentPlayer);
    });

    socket.on('highScores', (newHighScores) => {
        highScores = newHighScores;
        updateUI.updateHighScores(newHighScores);
    });

    socket.on('activePlayersBoard', (activePlayersData) => {
        updateUI.updateActivePlayersBoard(activePlayersData);
    });

    socket.on('playerDeath', (data) => {
        // Ensure that the high scores data is in the correct format
        const highScoresData = data.highScores || {
            title: "HIGH SCORES",
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            scores: []
        };

        // Create playerStats object with the finalScore
        const playerStats = {
            finalScore: data.finalScore
        };

        updateUI.showDeathPopup(playerStats, highScoresData);
    });

    // New event handlers for login and restart
    socket.on('loginSuccess', (data) => {
        updateUI.showLoginSuccess(data.message);
        if (data.ethereumAddress) {
            if (!currentPlayer) {
                currentPlayer = {};
            }
            currentPlayer.ethereumAddress = data.ethereumAddress;
        }
    });

    socket.on('loginFailed', (data) => {
        updateUI.showLoginFailed(data.message);
    });

    socket.on('restartFailed', (data) => {
        updateUI.showRestartFailed(data.message);
    });
}

// Export the setup function
window.setupNetworkHandlers = setupNetworkHandlers;
// game-client.js

const socket = io();

let VIEWPORT_WIDTH, VIEWPORT_HEIGHT, INTERPOLATION_FACTOR;
let gameConstantsReceived = false;
let ethereumAddress = null;
let highScores = [];
let currentPlayer = null;
let gameState = null;
let previousGameState = null;
let lastUpdateTime = 0;
let isDead = false;
let hitmarkerManager;
let isLoggedIn = false; // New flag to indicate if the player is logged in

function initGame() {
    // Initialize UI components
    CanvasManager.init();
    PlayerManager.init({
        scoreElement: document.getElementById('score-value'),
        activePlayersList: document.getElementById('active-players-list'),
        connectMetamaskButton: document.getElementById('connect-metamask'),
        connectMetamaskPopupButton: document.getElementById('connect-metamask-popup'),
        ethereumAddressElement: document.getElementById('ethereum-address')
    });
    PopupManager.init({
        deathPopup: document.getElementById('death-popup'),
        sntzlPopup: document.getElementById('sntzl-popup'),
        infoPopup: document.getElementById('info-popup')
    });
    MessageManager.init(document.getElementById('message-container'));

    // Initialize HitmarkerManager
    hitmarkerManager = new HitmarkerManager();

    // Setup input handlers
    setupInputHandlers(socket);

    // Setup network handlers
    setupNetworkHandlers(socket, gameState, currentPlayer, highScores, {
        showLoading: () => {
            document.getElementById('loading-message').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
        },
        showDisconnected: () => {
            document.getElementById('loading-message').textContent = 'Disconnected from server. Attempting to reconnect...';
            document.getElementById('loading-message').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
        },
        setGameConstants: (constants) => {
            ({ GAME_WIDTH, GAME_HEIGHT, INTERPOLATION_FACTOR } = constants);
            // Make GAME_WIDTH and GAME_HEIGHT globally available
            window.GAME_WIDTH = GAME_WIDTH;
            window.GAME_HEIGHT = GAME_HEIGHT;
            CanvasManager.resizeCanvases();
            gameConstantsReceived = true;
            // Start the game loop after receiving constants
            requestAnimationFrame(gameLoop);
        },
        updateGame: (newGameState, newCurrentPlayer) => {
            previousGameState = gameState;
            gameState = newGameState;
            lastUpdateTime = performance.now();
            if (newCurrentPlayer) {
                currentPlayer = newCurrentPlayer;
            }
            if (!isLoggedIn) {
                updateBackgroundMap();
            }
        },
        showDeathPopup: (playerStats, highScoresData) => {
            PopupManager.showDeathPopup(playerStats, highScoresData);
            // Update MetaMask connection status in death popup
            PlayerManager.updateConnectMetamaskButton(ethereumAddress);
            // Keep the 'in-game' class when showing death popup
            isDead = true;
        },
        updateHighScores: PopupManager.updateHighScores.bind(PopupManager),
        updateActivePlayersBoard: PlayerManager.updateActivePlayersBoard.bind(PlayerManager),
        showLoginSuccess: (message) => {
            MessageManager.showMessage(message, false, 1);
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('loading-message').style.display = 'none'; // Hide loading message
            if (gameConstantsReceived) {
                startGame();
            }
        },
        showLoginFailed: (message) => {
            MessageManager.showMessage(message, true);
            document.getElementById('loading-message').style.display = 'none'; // Hide loading message
            document.getElementById('login-form').style.display = 'block'; // Show login form again
        },
        showRestartFailed: (message) => {
            MessageManager.showMessage(message, true);
            PopupManager.hideDeathPopup();
        }
    });

    // Handle batched collision events
    socket.on('batchedCollisionEvents', (events) => {
        events.forEach(event => {
            if (event.playerId === socket.id) {
                let color;
                if (event.type === 'player_hit_sntzl_drop') {
                    color = '#ff0000'; // Red color for score deduction
                } else if (event.type === 'stnzl_collected') {
                    color = '#ffeab0'; // Gold color for STNZL collection
                } else {
                    color = '#ffeab0'; // White color for other events
                }
                hitmarkerManager.addHitmarker(event.x, event.y, event.points, color);
            }
        });
    });

    // MetaMask connection
    async function connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                ethereumAddress = accounts[0];
                PlayerManager.updateEthereumAddress(ethereumAddress);
            } catch (error) {
                alert('Failed to connect to MetaMask. Please try again.');
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    }

    document.getElementById('connect-metamask').addEventListener('click', connectMetaMask);
    document.getElementById('connect-metamask-popup').addEventListener('click', connectMetaMask);

    // Login functionality
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = document.getElementById('player-name').value.trim();
        if (playerName) {
            document.getElementById('loading-message').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';
            socket.emit('login', { name: playerName, ethereumAddress });
        }
    });

    // Event delegation for restart button
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'restart-button') {
            restartGame();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.getElementById('death-popup').style.display === 'flex') {
            restartGame();
        }
    });

    // Update MetaMask connection status when the page loads
    PlayerManager.updateConnectMetamaskButton(ethereumAddress);

    // Remove 'in-game' class when disconnected
    socket.on('disconnect', () => {
        document.body.classList.remove('in-game');
        isDead = false;
        isLoggedIn = false; // Reset the logged in flag
    });

    // Ensure loading message is hidden initially
    document.getElementById('loading-message').style.display = 'none';

    // Add event listeners for SNTZL and INFO buttons
    document.getElementById('sntzl-button').addEventListener('click', () => {
        PopupManager.showSntzlPopup();
    });

    document.getElementById('info-button').addEventListener('click', () => {
        PopupManager.showInfoPopup();
    });

    // Add event listeners for closing popups
    document.querySelectorAll('.close-popup').forEach(button => {
        button.addEventListener('click', () => {
            PopupManager.hidePopups();
        });
    });
}

function startGame() {
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    CanvasManager.resizeCanvases();
    // Add 'in-game' class when the game starts
    document.body.classList.add('in-game');
    isDead = false;
    isLoggedIn = true; // Set the logged in flag
}

function updateBackgroundMap() {
    if (gameState) {
        CanvasManager.updateBackgroundMap(gameState, isLoggedIn);
    }
}

function interpolateGameState(alpha) {
    if (!previousGameState || !gameState) return gameState;

    const interpolatedState = JSON.parse(JSON.stringify(gameState));

    // Interpolate player positions
    for (const playerId in interpolatedState.players) {
        if (previousGameState.players[playerId] && gameState.players[playerId]) {
            interpolatedState.players[playerId].x = lerp(previousGameState.players[playerId].x, gameState.players[playerId].x, alpha);
            interpolatedState.players[playerId].y = lerp(previousGameState.players[playerId].y, gameState.players[playerId].y, alpha);
            interpolatedState.players[playerId].angle = lerpAngle(previousGameState.players[playerId].angle, gameState.players[playerId].angle, alpha);
        }
    }

    // Interpolate asteroid positions
    for (const asteroidId in interpolatedState.asteroids) {
        if (previousGameState.asteroids[asteroidId] && gameState.asteroids[asteroidId]) {
            interpolatedState.asteroids[asteroidId].x = lerp(previousGameState.asteroids[asteroidId].x, gameState.asteroids[asteroidId].x, alpha);
            interpolatedState.asteroids[asteroidId].y = lerp(previousGameState.asteroids[asteroidId].y, gameState.asteroids[asteroidId].y, alpha);
            interpolatedState.asteroids[asteroidId].angle = lerpAngle(previousGameState.asteroids[asteroidId].angle, gameState.asteroids[asteroidId].angle, alpha);
        }
    }

    // Interpolate bullet positions
    for (const bulletId in interpolatedState.bullets) {
        if (previousGameState.bullets[bulletId] && gameState.bullets[bulletId]) {
            interpolatedState.bullets[bulletId].x = lerp(previousGameState.bullets[bulletId].x, gameState.bullets[bulletId].x, alpha);
            interpolatedState.bullets[bulletId].y = lerp(previousGameState.bullets[bulletId].y, gameState.bullets[bulletId].y, alpha);
        }
    }

    return interpolatedState;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpAngle(a, b, t) {
    const diff = b - a;
    const adjusted = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    return a + adjusted * t;
}

function gameLoop(timestamp) {
    if (!gameConstantsReceived) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const delta = timestamp - lastUpdateTime;
    const alpha = Math.min(delta / (1000 * INTERPOLATION_FACTOR), 1);

    if (gameState && currentPlayer) {
        const interpolatedState = interpolateGameState(alpha);
        hitmarkerManager.update();
        CanvasManager.updateGame(interpolatedState, currentPlayer, hitmarkerManager, isLoggedIn);
        PlayerManager.updateScore(currentPlayer.score);
        PlayerManager.updateActivePlayers();
    } else if (!isLoggedIn) {
        updateBackgroundMap();
    }
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    if (document.getElementById('death-popup')) {
        isDead = false;
        PopupManager.hideDeathPopup();
        socket.emit('restartGame', { ethereumAddress });
        // 'in-game' class is already present, no need to add it again
    }
}

// Make socket globally available
window.socket = socket;

// Initialize the game when the window loads
window.addEventListener('load', initGame);
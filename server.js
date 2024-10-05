const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    perMessageDeflate: {
        threshold: 1024,
        zlibDeflateOptions: {
            chunkSize: 16 * 1024
        },
        zlibInflateOptions: {
            windowBits: 14
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const game = require('./game');
const constants = require('./constants');

const HIGH_SCORES_FILE = 'highscores.json';

function loadHighScores() {
    try {
        const data = fs.readFileSync(HIGH_SCORES_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        
        if (parsedData.scores && Array.isArray(parsedData.scores) && parsedData.scores.length > 0) {
            return parsedData;
        } else {
            return {
                title: "HIGH SCORES",
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                prizes: [],
                scores: []
            };
        }
    } catch (error) {
        return {
            title: "HIGH SCORES",
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            prizes: [],
            scores: []
        };
    }
}

function saveHighScores(highScoresData) {
    try {
        const data = JSON.stringify(highScoresData, null, 2);
        fs.writeFileSync(HIGH_SCORES_FILE, data);
    } catch (error) {
        // Error handling without logging
    }
}

let highScoresData = loadHighScores();

function updateHighScores(player) {
    if (player.ethereumAddress && player.ethereumAddress.startsWith('0x') && player.ethereumAddress.length === 42) {
        const scoreEntry = {
            name: player.name,
            score: player.finalScore,
            ethereumAddress: player.ethereumAddress
        };

        const insertIndex = highScoresData.scores.findIndex(entry => player.finalScore > entry.score);

        if (insertIndex === -1 && highScoresData.scores.length < 100) {
            scoreEntry.position = highScoresData.scores.length + 1;
            highScoresData.scores.push(scoreEntry);
        } else if (insertIndex !== -1) {
            highScoresData.scores.splice(insertIndex, 0, scoreEntry);
        } else {
            return;
        }

        highScoresData.scores = highScoresData.scores.map((entry, index) => ({
            ...entry,
            position: index + 1
        }));

        highScoresData.scores = highScoresData.scores.slice(0, 100);

        saveHighScores(highScoresData);
    }
}

function getTopScores() {
    return {
        title: highScoresData.title,
        startDate: highScoresData.startDate,
        endDate: highScoresData.endDate,
        prizes: highScoresData.prizes,
        scores: highScoresData.scores.map(entry => ({
            name: entry.name,
            score: entry.score,
            ethereumAddress: entry.ethereumAddress,
            position: entry.position
        }))
    };
}

function getActivePlayersBoard() {
    const { leaderboard, changed } = game.getThrottledLeaderboard();
    return {
        title: "ACTIVE PLAYERS",
        scores: leaderboard,
        changed: changed
    };
}

app.get('/api/full-highscores', (req, res) => {
    res.json(getTopScores());
});

io.on('connection', (socket) => {
    // Include INTERPOLATION_FACTOR in the game constants sent to the client
    const clientConstants = {
        ...constants,
        INTERPOLATION_FACTOR: constants.INTERPOLATION_FACTOR
    };
    socket.emit('gameConstants', clientConstants);
    socket.emit('gameState', game.getState());

    socket.on('login', (playerData) => {
        if (game.isGameFull()) {
            socket.emit('loginFailed', { message: 'Server is full. Please try again later.' });
        } else {
            const playerAdded = game.addPlayer(socket.id, playerData.name, playerData.ethereumAddress);
            if (playerAdded) {
                socket.emit('loginSuccess', { message: 'Login successful' });
                socket.emit('highScores', getTopScores());
                io.emit('activePlayersBoard', getActivePlayersBoard());
            } else {
                socket.emit('loginFailed', { message: 'Unable to join the game. Please try again.' });
            }
        }
    });

    socket.on('disconnect', () => {
        const player = game.getPlayer(socket.id);
        if (player) {
            updateHighScores(player);
        }
        game.removePlayer(socket.id);
        io.emit('activePlayersBoard', getActivePlayersBoard());
    });

    socket.on('input', (data) => {
        game.handleInput(socket.id, data);
    });

    socket.on('requestGameState', () => {
        const gameState = game.getState();
        socket.emit('gameState', gameState);
    });

    socket.on('updateViewport', (viewportData) => {
        game.updatePlayerViewport(socket.id, viewportData.width, viewportData.height);
    });

    socket.on('restartGame', (data) => {
        const player = game.getPlayer(socket.id);
        if (player) {
            game.respawnPlayer(socket.id, data.ethereumAddress);
            socket.emit('gameState', game.getState());
        } else {
            if (game.isGameFull()) {
                socket.emit('restartFailed', { message: 'Server is full. Please try again later.' });
            } else {
                const playerAdded = game.addPlayer(socket.id, 'Player', data.ethereumAddress);
                if (playerAdded) {
                    socket.emit('gameState', game.getState());
                } else {
                    socket.emit('restartFailed', { message: 'Unable to join the game. Please try again.' });
                }
            }
        }
        io.emit('activePlayersBoard', getActivePlayersBoard());
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    // Server start message removed
});

const TICK_INTERVAL = 1000 / constants.TICK_RATE;
let lastUpdateTime = process.hrtime.bigint();

function gameLoop() {
    const now = process.hrtime.bigint();
    const delta = Number(now - lastUpdateTime) / 1e6; // Convert nanoseconds to milliseconds
    lastUpdateTime = now;

    const { deadPlayers, collisionEvents } = game.update(delta);

    let highScoresUpdated = false;

    deadPlayers.forEach(playerId => {
        const player = game.getPlayer(playerId);
        if (player) {
            updateHighScores(player);
            highScoresUpdated = true;
            io.to(playerId).emit('playerDeath', {
                finalScore: player.finalScore,
                highScores: getTopScores()
            });
        }
    });

    // Batch collision events for each player
    const batchedCollisionEvents = {};
    collisionEvents.forEach(event => {
        if (!batchedCollisionEvents[event.playerId]) {
            batchedCollisionEvents[event.playerId] = [];
        }
        batchedCollisionEvents[event.playerId].push(event);
    });

    // Send batched collision events to each player
    Object.entries(batchedCollisionEvents).forEach(([playerId, events]) => {
        io.to(playerId).emit('batchedCollisionEvents', events);
    });

    io.emit('gameState', game.getState());

    if (highScoresUpdated) {
        io.emit('highScores', getTopScores());
    }

    const activePlayersBoard = getActivePlayersBoard();
    if (activePlayersBoard.changed) {
        io.emit('activePlayersBoard', activePlayersBoard);
    }

    // Calculate the time taken for this game loop iteration
    const endTime = process.hrtime.bigint();
    const elapsedTime = Number(endTime - now) / 1e6; // Convert nanoseconds to milliseconds

    // If the game loop took less time than the tick interval, wait for the remaining time
    if (elapsedTime < TICK_INTERVAL) {
        setTimeout(() => setImmediate(gameLoop), TICK_INTERVAL - elapsedTime);
    } else {
        // If the game loop took longer than the tick interval, run the next iteration immediately
        setImmediate(gameLoop);
    }
}

// Initialize the game before starting the game loop
game.initializeGame();
gameLoop();
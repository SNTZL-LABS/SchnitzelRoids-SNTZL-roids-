const { HitmarkerManager } = require('./public/hitmarker');
const { createPlayer } = require('./player');
const {
    GAME_WIDTH,
    GAME_HEIGHT,
    LARGE_ASTEROID_COUNT,
    MAX_PLAYERS,
    DEFAULT_VIEWPORT_WIDTH,
    DEFAULT_VIEWPORT_HEIGHT,
    ASTEROID_SPAWN_INTERVAL
} = require('./constants');
const { createAsteroid, createSTNZLAsteroid, getSTNZLScoreReward } = require('./asteroid');
const { findSafeSpawnLocation } = require('./spawn-utils');

// Use Map for better performance with large numbers of players
const players = new Map();
let asteroids = [];
const hitmarkerManager = new HitmarkerManager();

let asteroidSpawnInterval;

// New variables for throttling Active Players Board Updates
let lastLeaderboardUpdate = Date.now();
const LEADERBOARD_UPDATE_INTERVAL = 2000; // 2 seconds
let lastLeaderboard = [];

/**
 * Checks if the game has reached the maximum number of players.
 * @returns {boolean} True if the game is full, false otherwise.
 */
function isGameFull() {
    return players.size >= MAX_PLAYERS;
}

/**
 * Adds a new player to the game.
 * @param {string} id - The unique identifier for the player.
 * @param {string} name - The player's name.
 * @param {string} ethereumAddress - The player's Ethereum address.
 * @returns {boolean} True if the player was successfully added, false otherwise.
 */
function addPlayer(id, name, ethereumAddress) {
    if (isGameFull()) {
        return false;
    }

    try {
        const spawnLocation = findSafeSpawnLocation(asteroids);
        if (spawnLocation) {
            const player = createPlayer(spawnLocation.x, spawnLocation.y);
            player.name = name;
            player.ethereumAddress = ethereumAddress;
            player.viewport = { width: DEFAULT_VIEWPORT_WIDTH, height: DEFAULT_VIEWPORT_HEIGHT };
            player.scoreUpdated = false;
            player.collectedSTNZL = 0;
            players.set(id, player);
            return true;
        }
    } catch (error) {
        // Error handling without logging
    }
    return false;
}

/**
 * Respawns a player in the game.
 * @param {string} id - The unique identifier for the player.
 * @param {string} ethereumAddress - The player's Ethereum address.
 */
function respawnPlayer(id, ethereumAddress) {
    const player = players.get(id);
    if (player) {
        try {
            const spawnLocation = findSafeSpawnLocation(asteroids);
            if (spawnLocation) {
                player.respawn(spawnLocation.x, spawnLocation.y);
                player.ethereumAddress = ethereumAddress;
                player.scoreUpdated = false;
                player.collectedSTNZL = 0;
            }
        } catch (error) {
            // Error handling without logging
        }
    }
}

/**
 * Removes a player from the game.
 * @param {string} id - The unique identifier for the player.
 */
function removePlayer(id) {
    players.delete(id);
}

/**
 * Updates a player's viewport dimensions.
 * @param {string} id - The unique identifier for the player.
 * @param {number} width - The new viewport width.
 * @param {number} height - The new viewport height.
 */
function updatePlayerViewport(id, width, height) {
    const player = players.get(id);
    if (player) {
        player.viewport = { width, height };
    }
}

/**
 * Updates all players' states.
 * @param {number} delta - The time elapsed since the last update.
 * @returns {string[]} An array of IDs of players who have died in this update.
 */
function updatePlayers(delta) {
    const deadPlayers = [];
    players.forEach((player, id) => {
        if (!player.isDead()) {
            player.update(delta);
        }
        if (player.isDead() && !player.scoreUpdated) {
            player.finalScore = player.score;
            deadPlayers.push(id);
            player.scoreUpdated = true;
        }
    });
    return deadPlayers;
}

/**
 * Updates all asteroids' states.
 * @param {number} delta - The time elapsed since the last update.
 */
function updateAsteroids(delta) {
    asteroids.forEach(asteroid => asteroid.update(delta));
}

/**
 * Spawns a new large asteroid in the game.
 */
function spawnLargeAsteroid() {
    try {
        const spawnLocation = findSafeSpawnLocation(asteroids);
        if (spawnLocation) {
            const newAsteroid = createAsteroid(spawnLocation.x, spawnLocation.y, 'large');
            asteroids.push(newAsteroid);
        }
    } catch (error) {
        // Error handling without logging
    }
}

/**
 * Maintains the desired number of large asteroids in the game.
 */
function maintainAsteroidCount() {
    const largeAsteroids = asteroids.filter(asteroid => asteroid.getState().size === 'large');
    const asteroidsToSpawn = LARGE_ASTEROID_COUNT - largeAsteroids.length;

    for (let i = 0; i < asteroidsToSpawn; i++) {
        spawnLargeAsteroid();
    }
}

/**
 * Initializes the asteroid spawning interval.
 */
function initializeAsteroidSpawning() {
    // Clear any existing interval
    if (asteroidSpawnInterval) {
        clearInterval(asteroidSpawnInterval);
    }

    // Set up the new interval using the ASTEROID_SPAWN_INTERVAL constant
    asteroidSpawnInterval = setInterval(maintainAsteroidCount, ASTEROID_SPAWN_INTERVAL);
}

/**
 * Gets the current state of the game.
 * @returns {Object} The current game state.
 */
function getState() {
    const playerStates = {};
    players.forEach((player, id) => {
        const playerState = player.getState();
        playerStates[id] = {
            ...playerState,
            name: player.name,
            score: player.score,
            finalScore: player.finalScore,
            viewport: player.viewport,
            ethereumAddress: player.ethereumAddress,
            collectedSTNZL: player.collectedSTNZL,
            sparks: playerState.sparks
        };
    });

    return {
        players: playerStates,
        asteroids: asteroids.map(asteroid => asteroid.getState()),
        hitmarkers: hitmarkerManager.hitmarkers,
    };
}

/**
 * Gets a player by their ID.
 * @param {string} id - The unique identifier for the player.
 * @returns {Object|undefined} The player object if found, undefined otherwise.
 */
function getPlayer(id) {
    return players.get(id);
}

/**
 * Gets all players in the game.
 * @returns {Map} A Map of all players, keyed by their IDs.
 */
function getPlayers() {
    return players;
}

/**
 * Gets an array of all players' states.
 * @returns {Object[]} An array of player state objects.
 */
function getAllPlayers() {
    return Array.from(players.values()).map(player => {
        const playerState = player.getState();
        return {
            name: player.name,
            score: player.score,
            finalScore: player.finalScore,
            ethereumAddress: player.ethereumAddress,
            collectedSTNZL: player.collectedSTNZL,
            ...playerState,
            sparks: playerState.sparks
        };
    });
}

/**
 * Gets the current leaderboard, throttled to update every LEADERBOARD_UPDATE_INTERVAL milliseconds.
 * @returns {Object} An object containing the leaderboard and a boolean indicating if it has changed.
 */
function getThrottledLeaderboard() {
    const currentTime = Date.now();
    if (currentTime - lastLeaderboardUpdate >= LEADERBOARD_UPDATE_INTERVAL) {
        const currentLeaderboard = getAllPlayers()
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(player => ({
                name: player.name,
                score: player.score,
                ethereumAddress: player.ethereumAddress
            }));

        const leaderboardChanged = JSON.stringify(currentLeaderboard) !== JSON.stringify(lastLeaderboard);
        
        lastLeaderboard = currentLeaderboard;
        lastLeaderboardUpdate = currentTime;

        return { leaderboard: currentLeaderboard, changed: leaderboardChanged };
    }

    return { leaderboard: lastLeaderboard, changed: false };
}

module.exports = {
    players,
    asteroids,
    hitmarkerManager,
    isGameFull,
    addPlayer,
    respawnPlayer,
    removePlayer,
    updatePlayerViewport,
    updatePlayers,
    updateAsteroids,
    spawnLargeAsteroid,
    maintainAsteroidCount,
    initializeAsteroidSpawning,
    getState,
    getPlayer,
    getPlayers,
    getAllPlayers,
    getThrottledLeaderboard
};
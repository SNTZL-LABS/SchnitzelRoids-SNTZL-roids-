const { createPlayer } = require('./player');
const { createAsteroid } = require('./asteroid');
const {
    players,
    asteroids,
    hitmarkerManager,
    isGameFull,
    addPlayer,
    removePlayer,
    respawnPlayer,
    updatePlayerViewport,
    updatePlayers,
    updateAsteroids,
    spawnLargeAsteroid,
    initializeAsteroidSpawning,
    getState,
    getPlayer,
    getPlayers,
    getAllPlayers,
    getThrottledLeaderboard
} = require('./game-state');
const { handleCollisions } = require('./collision-handler');

/**
 * Handles player input for movement, shooting, and shield activation.
 * @param {string} id - The player's unique identifier.
 * @param {Object} input - The input object containing player actions.
 */
function handleInput(id, input) {
    const player = players.get(id);
    if (player && !player.isDead()) {
        player.handleInput(input);
        if (input.shoot) {
            player.shoot();
        }
        if (input.shield) {
            player.activateShield();
        }
    }
}

/**
 * Updates the game state for a single frame.
 * @param {number} delta - The time elapsed since the last update in milliseconds.
 * @returns {Object} An object containing arrays of dead players and collision events.
 */
function update(delta) {
    try {
        const deadPlayers = updatePlayers(delta);
        updateAsteroids(delta);
        const collisionEvents = handleCollisions(players, asteroids, spawnLargeAsteroid);
        hitmarkerManager.update();
        return { deadPlayers, collisionEvents };
    } catch (error) {
        return { deadPlayers: [], collisionEvents: [] };
    }
}

/**
 * Initializes the game, including setting up the asteroid spawning interval.
 */
function initializeGame() {
    initializeAsteroidSpawning();
}

module.exports = {
    addPlayer,
    removePlayer,
    respawnPlayer,
    handleInput,
    updatePlayerViewport,
    update,
    getState,
    getPlayer,
    getPlayers,
    getAllPlayers,
    isGameFull,
    initializeGame,
    getThrottledLeaderboard
};
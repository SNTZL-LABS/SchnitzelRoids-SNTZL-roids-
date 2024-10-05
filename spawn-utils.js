const {
    GAME_WIDTH,
    GAME_HEIGHT,
    SAFE_ZONE_RADIUS,
    MAX_SPAWN_ATTEMPTS,
    STNZL_ASTEROID_RADIUS,
    SNTZL_SPAWN_VELOCITY_FACTOR
} = require('./constants');

const { createSTNZLAsteroid } = require('./asteroid');

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isSafeFromAsteroids(x, y, asteroids) {
    return asteroids.every(asteroid => {
        const asteroidState = asteroid.getState();
        return calculateDistance(x, y, asteroidState.pos.x, asteroidState.pos.y) > SAFE_ZONE_RADIUS + asteroidState.radius;
    });
}

function isSafeSpawnLocation(x, y, players, asteroids) {
    return Object.values(players).every(player => {
        const playerState = player.getState();
        return calculateDistance(x, y, playerState.pos.x, playerState.pos.y) > SAFE_ZONE_RADIUS;
    }) && isSafeFromAsteroids(x, y, asteroids);
}

function getRandomSpawnLocation() {
    return {
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT
    };
}

function findSafeSpawnLocation(asteroids, players = {}) {
    let spawnLocation;
    let attempts = 0;

    do {
        spawnLocation = getRandomSpawnLocation();
        attempts++;
    } while (!isSafeSpawnLocation(spawnLocation.x, spawnLocation.y, players, asteroids) && attempts < MAX_SPAWN_ATTEMPTS);

    if (attempts < MAX_SPAWN_ATTEMPTS) {
        return spawnLocation;
    } else {
        return null;
    }
}

function spawnSNTZLAsteroidA(shipX, shipY, shipAngle, shipVelX = 0, shipVelY = 0) {
    // Calculate the spawn position behind the spaceship
    const spawnDistance = STNZL_ASTEROID_RADIUS * 3; // Increased distance behind the ship
    
    // Adjust spawn position based on ship's velocity
    const adjustedX = shipX - Math.cos(shipAngle) * spawnDistance - shipVelX * SNTZL_SPAWN_VELOCITY_FACTOR;
    const adjustedY = shipY - Math.sin(shipAngle) * spawnDistance - shipVelY * SNTZL_SPAWN_VELOCITY_FACTOR;
    
    // Ensure the spawn position is within the game boundaries
    const clampedX = Math.max(STNZL_ASTEROID_RADIUS, Math.min(adjustedX, GAME_WIDTH - STNZL_ASTEROID_RADIUS));
    const clampedY = Math.max(STNZL_ASTEROID_RADIUS, Math.min(adjustedY, GAME_HEIGHT - STNZL_ASTEROID_RADIUS));
    
    // Create and return the SNTZL-asteroid A
    return createSTNZLAsteroid(clampedX, clampedY, 'A');
}

module.exports = {
    calculateDistance,
    isSafeFromAsteroids,
    isSafeSpawnLocation,
    getRandomSpawnLocation,
    findSafeSpawnLocation,
    spawnSNTZLAsteroidA
};
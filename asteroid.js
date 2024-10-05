const {
    GAME_WIDTH,
    GAME_HEIGHT,
    LARGE_ASTEROID_RADIUS,
    MEDIUM_ASTEROID_RADIUS,
    SMALL_ASTEROID_RADIUS,
    ASTEROID_SPEED,
    STNZL_ASTEROID_RADIUS,
    STNZL_VARIANTS,
    STNZL_WEIGHTS,
    STNZL_SCORE_REWARDS
} = require('./constants');

function createAsteroid(x, y, size = 'large', variant = null) {
    let pos = { 
        x: x || Math.random() * GAME_WIDTH, 
        y: y || Math.random() * GAME_HEIGHT 
    };
    let vel = {
        x: (Math.random() - 0.5) * ASTEROID_SPEED,
        y: (Math.random() - 0.5) * ASTEROID_SPEED
    };

    // Define radius based on size
    let radius;
    switch(size) {
        case 'large':
            radius = LARGE_ASTEROID_RADIUS;
            break;
        case 'medium':
            radius = MEDIUM_ASTEROID_RADIUS;
            break;
        case 'small':
            radius = SMALL_ASTEROID_RADIUS;
            break;
        case 'stnzl':
            radius = STNZL_ASTEROID_RADIUS;
            break;
        default:
            radius = LARGE_ASTEROID_RADIUS; // Default to large if an invalid size is provided
    }

    function update(delta) {
        pos.x += vel.x * delta;
        pos.y += vel.y * delta;

        // Wrap around screen
        pos.x = (pos.x + GAME_WIDTH) % GAME_WIDTH;
        pos.y = (pos.y + GAME_HEIGHT) % GAME_HEIGHT;
    }

    function split() {
        if (size === 'large') {
            return [
                createAsteroid(pos.x, pos.y, 'medium'),
                createAsteroid(pos.x, pos.y, 'medium')
            ];
        } else if (size === 'medium') {
            return [
                createAsteroid(pos.x, pos.y, 'small'),
                createAsteroid(pos.x, pos.y, 'small')
            ];
        }
        return []; // Small and STNZL asteroids don't split
    }

    function getState() {
        return { pos, vel, radius, size, variant };
    }

    function setVelocity(newVel) {
        vel = newVel;
    }

    return { update, split, getState, setVelocity };
}

function createSTNZLAsteroid(x, y, specificVariant = null) {
    let selectedVariant;

    if (specificVariant && STNZL_VARIANTS.includes(specificVariant)) {
        selectedVariant = specificVariant;
    } else {
        const weights = STNZL_WEIGHTS;
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const randomValue = Math.random() * totalWeight;
        
        let cumulativeWeight = 0;
        for (let i = 0; i < STNZL_VARIANTS.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue <= cumulativeWeight) {
                selectedVariant = STNZL_VARIANTS[i];
                break;
            }
        }
    }

    return createAsteroid(x, y, 'stnzl', selectedVariant);
}

function getSTNZLScoreReward(variant) {
    return STNZL_SCORE_REWARDS[variant] || 0;
}

module.exports = { createAsteroid, createSTNZLAsteroid, getSTNZLScoreReward };
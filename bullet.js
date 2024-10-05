const {
    GAME_WIDTH,
    GAME_HEIGHT,
    BULLET_RADIUS,
    BULLET_LIFESPAN
} = require('./constants');

function createBullet(x, y, vx, vy) {
    let pos = { x, y };
    let vel = { x: vx, y: vy };
    let radius = BULLET_RADIUS;
    let lifespan = BULLET_LIFESPAN;

    function update(delta) {
        pos.x += vel.x * delta;
        pos.y += vel.y * delta;

        // Wrap around screen
        pos.x = (pos.x + GAME_WIDTH) % GAME_WIDTH;
        pos.y = (pos.y + GAME_HEIGHT) % GAME_HEIGHT;

        lifespan -= delta;
    }

    function isActive() {
        return lifespan > 0;
    }

    function deactivate() {
        lifespan = 0;
    }

    function getState() {
        return { pos, vel, radius };
    }

    return { update, isActive, deactivate, getState };
}

module.exports = { createBullet };
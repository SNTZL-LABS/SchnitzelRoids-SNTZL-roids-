const { checkCollision } = require('./collision');
const {
    PLAYER_SCORE_SMALL_ASTEROID,
    PLAYER_SCORE_MEDIUM_ASTEROID,
    PLAYER_SCORE_LARGE_ASTEROID,
    STNZL_SPAWN_CHANCE,
    ASTEROID_SPEED,
    PLAYER_HIT_SNTZL_SPAWN_CHANCE,
    STNZL_SCORE_REWARDS
} = require('./constants');
const { createSTNZLAsteroid, getSTNZLScoreReward } = require('./asteroid');
const { spawnSNTZLAsteroidA } = require('./spawn-utils');

function handleCollisions(players, asteroids, spawnLargeAsteroid) {
    const collisionEvents = [];

    players.forEach((player, playerId) => {
        if (player.isDead()) return;

        const playerState = player.getState();

        // Check bullet-asteroid collisions
        player.getBullets().forEach(bullet => {
            asteroids.forEach((asteroid, index) => {
                const bulletState = bullet.getState();
                const asteroidState = asteroid.getState();
                if (bulletState && asteroidState && checkCollision(bulletState, asteroidState)) {
                    bullet.deactivate();
                    if (asteroidState.size !== 'stnzl') {
                        const newAsteroids = asteroid.split();
                        if (newAsteroids.length > 0) {
                            asteroids.splice(index, 1, ...newAsteroids);
                            // Chance to spawn STNZL-asteroid
                            if (asteroidState.size === 'medium' && Math.random() < STNZL_SPAWN_CHANCE) {
                                const stnzlAsteroid = createSTNZLAsteroid(asteroidState.pos.x, asteroidState.pos.y);
                                asteroids.push(stnzlAsteroid);
                            }
                        } else {
                            asteroids.splice(index, 1);
                        }
                        // Increase score for the player who shot the bullet
                        let scoreIncrease;
                        switch (asteroidState.size) {
                            case 'large':
                                scoreIncrease = PLAYER_SCORE_LARGE_ASTEROID;
                                break;
                            case 'medium':
                                scoreIncrease = PLAYER_SCORE_MEDIUM_ASTEROID;
                                break;
                            case 'small':
                                scoreIncrease = PLAYER_SCORE_SMALL_ASTEROID;
                                break;
                            default:
                                scoreIncrease = 0;
                        }
                        player.addScore(scoreIncrease);
                        
                        // Add collision event for hitmarker
                        collisionEvents.push({
                            type: 'asteroid_destroyed',
                            playerId: playerId,
                            x: bulletState.pos.x,
                            y: bulletState.pos.y,
                            points: scoreIncrease
                        });

                        // Spawn a new large asteroid when one is destroyed
                        if (asteroidState.size === 'large') {
                            spawnLargeAsteroid();
                        }
                    }
                }
            });

            // Check bullet-player collisions
            players.forEach((targetPlayer, targetPlayerId) => {
                if (targetPlayerId !== playerId && !targetPlayer.isDead()) {
                    const targetPlayerState = targetPlayer.getState();
                    const bulletState = bullet.getState();
                    if (bulletState && checkCollision(bulletState, targetPlayerState)) {
                        bullet.deactivate();
                        if (!targetPlayerState.shieldActive) {
                            // Player hit by bullet, 25% chance to spawn SNTZL-asteroid A if player has collected at least one SNTZL
                            if (targetPlayer.collectedSTNZL > 0 && Math.random() < PLAYER_HIT_SNTZL_SPAWN_CHANCE) {
                                const newSNTZLAsteroid = spawnSNTZLAsteroidA(
                                    targetPlayerState.pos.x,
                                    targetPlayerState.pos.y,
                                    targetPlayerState.angle,
                                    targetPlayerState.vel.x,
                                    targetPlayerState.vel.y
                                );
                                asteroids.push(newSNTZLAsteroid);
                                targetPlayer.dropSTNZL();
                                targetPlayer.deductScore(STNZL_SCORE_REWARDS.A);
                                
                                // Add collision event for hitmarker (score deduction)
                                collisionEvents.push({
                                    type: 'player_hit_sntzl_drop',
                                    playerId: targetPlayerId,
                                    x: targetPlayerState.pos.x,
                                    y: targetPlayerState.pos.y,
                                    points: -STNZL_SCORE_REWARDS.A
                                });
                            }
                        }
                    }
                }
            });
        });

        // Check player-asteroid collisions
        asteroids.forEach((asteroid, index) => {
            const asteroidState = asteroid.getState();
            if (asteroidState && checkCollision(playerState, asteroidState)) {
                if (asteroidState.size === 'stnzl') {
                    // Collect STNZL-asteroid (can be collected even with shield active)
                    const scoreReward = getSTNZLScoreReward(asteroidState.variant);
                    player.addScore(scoreReward);
                    player.collectSTNZL();
                    asteroids.splice(index, 1);
                    
                    // Add collision event for hitmarker
                    collisionEvents.push({
                        type: 'stnzl_collected',
                        playerId: playerId,
                        x: asteroidState.pos.x,
                        y: asteroidState.pos.y,
                        points: scoreReward
                    });
                } else if (playerState.shieldActive) {
                    // Bounce the asteroid away (excluding STNZL asteroids)
                    const dx = asteroidState.pos.x - playerState.pos.x;
                    const dy = asteroidState.pos.y - playerState.pos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Calculate new velocity components
                    let newVelX = (dx / distance) * ASTEROID_SPEED;
                    let newVelY = (dy / distance) * ASTEROID_SPEED;
                    
                    // Ensure the new velocity doesn't exceed ASTEROID_SPEED
                    const newSpeed = Math.sqrt(newVelX * newVelX + newVelY * newVelY);
                    if (newSpeed > ASTEROID_SPEED) {
                        const scale = ASTEROID_SPEED / newSpeed;
                        newVelX *= scale;
                        newVelY *= scale;
                    }
                    
                    // Update asteroid velocity
                    asteroid.setVelocity({ x: newVelX, y: newVelY });
                    
                    // Move the asteroid outside of the shield
                    const overlapDistance = playerState.shieldRadius + asteroidState.radius - distance;
                    asteroidState.pos.x += (dx / distance) * overlapDistance;
                    asteroidState.pos.y += (dy / distance) * overlapDistance;
                    
                    // Note: We've removed the collision event for shield bounce to prevent hitmarker display
                } else {
                    // Regular asteroid collision
                    const hitResult = player.hit();
                    if (hitResult.playerDead) {
                        // Ensure the finalScore is set to the current score when the player dies
                        player.finalScore = player.score;
                    } else if (player.collectedSTNZL > 0 && Math.random() < PLAYER_HIT_SNTZL_SPAWN_CHANCE) {
                        // 25% chance to spawn SNTZL-asteroid A and deduct score if player has collected SNTZL
                        const newSNTZLAsteroid = spawnSNTZLAsteroidA(
                            playerState.pos.x,
                            playerState.pos.y,
                            playerState.angle,
                            playerState.vel.x,
                            playerState.vel.y
                        );
                        asteroids.push(newSNTZLAsteroid);
                        player.dropSTNZL();
                        player.deductScore(STNZL_SCORE_REWARDS.A);
                        
                        // Add collision event for hitmarker (score deduction)
                        collisionEvents.push({
                            type: 'player_hit_sntzl_drop',
                            playerId: playerId,
                            x: playerState.pos.x,
                            y: playerState.pos.y,
                            points: -STNZL_SCORE_REWARDS.A
                        });
                    }
                }
            }
        });
    });

    return collisionEvents;
}

module.exports = {
    handleCollisions
};
const { createBullet } = require('./bullet');
const {
    GAME_WIDTH,
    GAME_HEIGHT,
    PLAYER_ROTATION_SPEED,
    PLAYER_ACCELERATION,
    PLAYER_FRICTION,
    PLAYER_MAX_SPEED,
    PLAYER_RADIUS,
    PLAYER_SHOOT_COOLDOWN,
    PLAYER_INITIAL_LIVES,
    BULLET_SPEED,
    SHIELD_DURATION,
    SHIELD_COOLDOWN,
    SHIELD_RADIUS,
    BOOST_SPEED_MULTIPLIER,
    BOOST_DURATION,
    BOOST_COOLDOWN,
    SLOWDOWN_DURATION,
    SPARK_COUNT,
    SPARK_SPREAD_ANGLE,
    SPARK_DISTANCE,
    SPARK_VELOCITY,
    SPARK_LIFETIME,
    SPARK_VELOCITY_INCREASE
} = require('./constants');

function createPlayer(x, y) {
    let pos = { x, y };
    let vel = { x: 0, y: 0 };
    let angle = 0;
    let shootCooldown = 0;
    let thrust = false;
    let rotateLeft = false;
    let rotateRight = false;
    let bullets = [];
    let dead = false;
    let lives = PLAYER_INITIAL_LIVES;
    let score = 0;
    let finalScore = 0;
    let sparks = [];
    let collectedSTNZL = 0; // New property to track collected SNTZL asteroids

    // Shield properties
    let shieldActive = false;
    let shieldTimer = 0;
    let shieldCooldownTimer = 0;

    // Boost properties
    let isBoosting = false;
    let boostTimer = 0;
    let boostCooldownTimer = 0;
    let slowdownTimer = 0;

    function handleInput(input) {
        if (dead) return;
        rotateLeft = input.left;
        rotateRight = input.right;
        thrust = input.up;
        if (input.shoot && shootCooldown <= 0) {
            shoot();
            shootCooldown = PLAYER_SHOOT_COOLDOWN;
        }
        if (input.shield) {
            activateShield();
        }
        if (input.boost) {
            activateBoost();
        }
    }

    function update(delta) {
        if (dead) return;

        // Rotation
        if (rotateLeft) angle -= PLAYER_ROTATION_SPEED * delta;
        if (rotateRight) angle += PLAYER_ROTATION_SPEED * delta;

        // Calculate current max speed
        let currentMaxSpeed = PLAYER_MAX_SPEED;
        if (isBoosting) {
            currentMaxSpeed *= BOOST_SPEED_MULTIPLIER;
        } else if (slowdownTimer > 0) {
            const slowdownProgress = slowdownTimer / SLOWDOWN_DURATION;
            currentMaxSpeed = PLAYER_MAX_SPEED + (PLAYER_MAX_SPEED * (BOOST_SPEED_MULTIPLIER - 1) * slowdownProgress);
        }

        // Thrust
        if (thrust) {
            const thrustMultiplier = isBoosting ? BOOST_SPEED_MULTIPLIER : 1;
            vel.x += Math.cos(angle) * PLAYER_ACCELERATION * delta * thrustMultiplier;
            vel.y += Math.sin(angle) * PLAYER_ACCELERATION * delta * thrustMultiplier;
            createSparks();
        }

        // Apply friction
        vel.x *= Math.pow(PLAYER_FRICTION, delta / 16.67); // 16.67 is approx. 60 FPS
        vel.y *= Math.pow(PLAYER_FRICTION, delta / 16.67);

        // Limit speed
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        if (speed > currentMaxSpeed) {
            vel.x = (vel.x / speed) * currentMaxSpeed;
            vel.y = (vel.y / speed) * currentMaxSpeed;
        }

        // Update position
        pos.x += vel.x * delta;
        pos.y += vel.y * delta;

        // Wrap around screen
        pos.x = (pos.x + GAME_WIDTH) % GAME_WIDTH;
        pos.y = (pos.y + GAME_HEIGHT) % GAME_HEIGHT;

        if (shootCooldown > 0) shootCooldown -= delta;

        // Update and filter out inactive bullets
        bullets = bullets.filter(bullet => {
            bullet.update(delta);
            return bullet.isActive();
        });

        // Update sparks
        updateSparks(delta);

        // Update shield
        updateShield(delta);

        // Update boost
        updateBoost(delta);
    }

    function createSparks() {
        for (let i = 0; i < SPARK_COUNT; i++) {
            const spreadRad = (Math.random() * SPARK_SPREAD_ANGLE - SPARK_SPREAD_ANGLE / 2) * Math.PI / 180;
            const sparkPos = {
                x: pos.x - Math.cos(angle) * SPARK_DISTANCE,
                y: pos.y - Math.sin(angle) * SPARK_DISTANCE
            };
            const sparkVelocity = {
                x: -Math.cos(angle + spreadRad) * SPARK_VELOCITY,
                y: -Math.sin(angle + spreadRad) * SPARK_VELOCITY
            };
            sparks.push({
                pos: sparkPos,
                velocity: sparkVelocity,
                createdAt: Date.now(),
                initialDistance: SPARK_DISTANCE
            });
        }
    }

    function updateSparks(delta) {
        const currentTime = Date.now();
        sparks = sparks.filter(spark => {
            const age = currentTime - spark.createdAt;
            if (age < SPARK_LIFETIME) {
                // Update spark position based on its velocity
                spark.pos.x += spark.velocity.x * delta;
                spark.pos.y += spark.velocity.y * delta;

                // Increase velocity slightly to create a spreading effect
                spark.velocity.x *= SPARK_VELOCITY_INCREASE;
                spark.velocity.y *= SPARK_VELOCITY_INCREASE;

                return true;
            }
            return false;
        });
    }

    function shoot() {
        if (dead) return null;
        const bulletVel = {
            x: Math.cos(angle) * BULLET_SPEED + vel.x,
            y: Math.sin(angle) * BULLET_SPEED + vel.y
        };
        const newBullet = createBullet(pos.x, pos.y, bulletVel.x, bulletVel.y);
        bullets.push(newBullet);
        return newBullet;
    }

    function hit() {
        if (shieldActive) return { shieldHit: true, playerDead: false };
        lives--;
        if (lives <= 0) {
            dead = true;
            finalScore = score; // Set the final score when the player dies
        }
        return { shieldHit: false, playerDead: dead, position: { ...pos } };
    }

    function respawn(x, y) {
        pos.x = x;
        pos.y = y;
        vel.x = 0;
        vel.y = 0;
        angle = 0;
        dead = false;
        lives = PLAYER_INITIAL_LIVES;
        bullets = [];
        sparks = [];
        shootCooldown = 0;
        thrust = false;
        rotateLeft = false;
        rotateRight = false;
        shieldActive = false;
        shieldTimer = 0;
        shieldCooldownTimer = 0;
        isBoosting = false;
        boostTimer = 0;
        boostCooldownTimer = 0;
        slowdownTimer = 0;
        score = 0;
        finalScore = 0;
        collectedSTNZL = 0; // Reset collected SNTZL count on respawn
    }

    function isDead() {
        return dead;
    }

    function getState() {
        return {
            pos,
            vel, // Include velocity in the player state
            angle,
            radius: PLAYER_RADIUS,
            thrust,
            bullets: bullets.map(b => b.getState()),
            sparks: sparks.map(s => ({ pos: s.pos, createdAt: s.createdAt, initialDistance: s.initialDistance })),
            dead,
            lives,
            shieldActive,
            shieldRadius: SHIELD_RADIUS,
            shieldCooldownProgress: 1 - (shieldCooldownTimer / SHIELD_COOLDOWN),
            isBoosting,
            boostCooldownProgress: 1 - (boostCooldownTimer / BOOST_COOLDOWN),
            score,
            finalScore,
            collectedSTNZL // Include collected SNTZL count in the state
        };
    }

    function getBullets() {
        return bullets;
    }

    function activateShield() {
        if (!shieldActive && shieldCooldownTimer <= 0) {
            shieldActive = true;
            shieldTimer = SHIELD_DURATION;
        }
    }

    function updateShield(delta) {
        if (shieldActive) {
            shieldTimer -= delta;
            if (shieldTimer <= 0) {
                shieldActive = false;
                shieldCooldownTimer = SHIELD_COOLDOWN;
            }
        } else if (shieldCooldownTimer > 0) {
            shieldCooldownTimer -= delta;
        }
    }

    function activateBoost() {
        if (!isBoosting && boostCooldownTimer <= 0) {
            isBoosting = true;
            boostTimer = BOOST_DURATION;
        }
    }

    function updateBoost(delta) {
        if (isBoosting) {
            boostTimer -= delta;
            if (boostTimer <= 0) {
                isBoosting = false;
                boostCooldownTimer = BOOST_COOLDOWN;
                slowdownTimer = SLOWDOWN_DURATION;
            }
        } else if (boostCooldownTimer > 0) {
            boostCooldownTimer -= delta;
        }

        if (slowdownTimer > 0) {
            slowdownTimer -= delta;
            if (slowdownTimer < 0) slowdownTimer = 0;
        }
    }

    function addScore(points) {
        score += points;
    }

    function deductScore(points) {
        score = Math.max(0, score - points);
    }

    function collectSTNZL() {
        collectedSTNZL++;
    }

    function dropSTNZL() {
        if (collectedSTNZL > 0) {
            collectedSTNZL--;
            return true;
        }
        return false;
    }

    return {
        handleInput,
        update,
        shoot,
        hit,
        respawn,
        isDead,
        getState,
        getBullets,
        activateShield,
        activateBoost,
        addScore,
        deductScore,
        collectSTNZL,
        dropSTNZL,
        get score() { return score; },
        set score(value) { score = value; },
        get finalScore() { return finalScore; },
        set finalScore(value) { finalScore = value; },
        get collectedSTNZL() { return collectedSTNZL; },
        set collectedSTNZL(value) { collectedSTNZL = value; }
    };
}

module.exports = { createPlayer };
// Game dimensions
const GAME_WIDTH = 4000;
const GAME_HEIGHT = 4000;

// Viewport dimensions
const VIEWPORT_WIDTH = 'dynamic';
const VIEWPORT_HEIGHT = 'dynamic';
const DEFAULT_VIEWPORT_WIDTH = 800;
const DEFAULT_VIEWPORT_HEIGHT = 600;

// Safe zone and spawn settings
const SAFE_ZONE_RADIUS = 200;
const MAX_SPAWN_ATTEMPTS = 50;

// Asteroid constants
const LARGE_ASTEROID_COUNT = 75;
const LARGE_ASTEROID_RADIUS = 80;
const MEDIUM_ASTEROID_RADIUS = 40;
const SMALL_ASTEROID_RADIUS = 20;
const ASTEROID_SPEED = 0.1;
const ASTEROID_SPAWN_INTERVAL = 5000; // milliseconds

// STNZL-asteroid constants
const STNZL_ASTEROID_RADIUS = 20;
const STNZL_SPAWN_CHANCE = 0.2;
const STNZL_VARIANTS = ['A', 'B', 'C', 'D'];
const STNZL_WEIGHTS = [50, 10, 5, 1];
const STNZL_SCORE_REWARDS = {
    'A': 500,
    'B': 1000,
    'C': 2000,
    'D': 5000
};
const PLAYER_HIT_SNTZL_SPAWN_CHANCE = 0.25;
const SNTZL_SPAWN_VELOCITY_FACTOR = 0.5;

// Bullet constants
const BULLET_RADIUS = 2;
const BULLET_LIFESPAN = 1500; // milliseconds
const BULLET_SPEED = 0.4;

// Player constants
const PLAYER_ROTATION_SPEED = 0.005;
const PLAYER_ACCELERATION = 0.001;
const PLAYER_FRICTION = 0.99;
const PLAYER_MAX_SPEED = 0.5;
const PLAYER_RADIUS = 20;
const PLAYER_SHOOT_COOLDOWN = 200; // milliseconds
const PLAYER_INITIAL_LIVES = 3;
const MAX_PLAYERS = 16; // maximum number of players on server

// Scoring constants
const PLAYER_SCORE_SMALL_ASTEROID = 100;
const PLAYER_SCORE_MEDIUM_ASTEROID = 50;
const PLAYER_SCORE_LARGE_ASTEROID = 25;

// Shield constants
const SHIELD_DURATION = 3000; // milliseconds
const SHIELD_COOLDOWN = 5000; // milliseconds
const SHIELD_RADIUS = PLAYER_RADIUS + 10; // 10 pixels larger than the player
const SHIELD_COLOR = '#3498db'; // Cyan color for the shield
const SHIELD_OPACITY = 0.5;
const SHIELD_INDICATOR_WIDTH = 100;
const SHIELD_INDICATOR_HEIGHT = 20;
const SHIELD_INDICATOR_COLOR = '#3498db';
const SHIELD_INDICATOR_BG_COLOR = '#333333';

// Boost constants
const BOOST_SPEED_MULTIPLIER = 1.7;
const BOOST_DURATION = 1000; // milliseconds
const BOOST_COOLDOWN = 5000; // milliseconds
const BOOST_DOUBLE_TAP_WINDOW = 350; // milliseconds
const BOOST_INDICATOR_WIDTH = 100;
const BOOST_INDICATOR_HEIGHT = 20;
const BOOST_INDICATOR_COLOR = '#FFA500'; // Orange color for the boost

// Slowdown constants
const SLOWDOWN_DURATION = 1000; // milliseconds

// Server and interpolation constants
const TICK_RATE = 40; // Server tick rate (FPS)
const INTERPOLATION_FACTOR = 1 / TICK_RATE; // Interpolation factor based on server tick rate

// Spark constants
const SPARK_COUNT = 6; // Number of sparks to create per thrust
const SPARK_SPREAD_ANGLE = 80; // Spread angle in degrees
const SPARK_DISTANCE = 15; // Distance behind the ship for spark creation
const SPARK_VELOCITY = 0.15; // Base velocity for sparks
const SPARK_LIFETIME = 1000; // Lifetime of sparks in milliseconds
const SPARK_VELOCITY_INCREASE = 1.01; // Velocity increase factor for sparks

module.exports = {
    GAME_WIDTH,
    GAME_HEIGHT,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    DEFAULT_VIEWPORT_WIDTH,
    DEFAULT_VIEWPORT_HEIGHT,
    SAFE_ZONE_RADIUS,
    MAX_SPAWN_ATTEMPTS,
    LARGE_ASTEROID_COUNT,
    LARGE_ASTEROID_RADIUS,
    MEDIUM_ASTEROID_RADIUS,
    SMALL_ASTEROID_RADIUS,
    ASTEROID_SPEED,
    ASTEROID_SPAWN_INTERVAL,
    STNZL_ASTEROID_RADIUS,
    STNZL_SPAWN_CHANCE,
    STNZL_VARIANTS,
    STNZL_WEIGHTS,
    STNZL_SCORE_REWARDS,
    PLAYER_HIT_SNTZL_SPAWN_CHANCE,
    SNTZL_SPAWN_VELOCITY_FACTOR,
    BULLET_RADIUS,
    BULLET_LIFESPAN,
    BULLET_SPEED,
    PLAYER_ROTATION_SPEED,
    PLAYER_ACCELERATION,
    PLAYER_FRICTION,
    PLAYER_MAX_SPEED,
    PLAYER_RADIUS,
    PLAYER_SHOOT_COOLDOWN,
    PLAYER_INITIAL_LIVES,
    MAX_PLAYERS,
    PLAYER_SCORE_SMALL_ASTEROID,
    PLAYER_SCORE_MEDIUM_ASTEROID,
    PLAYER_SCORE_LARGE_ASTEROID,
    SHIELD_DURATION,
    SHIELD_COOLDOWN,
    SHIELD_RADIUS,
    SHIELD_COLOR,
    SHIELD_OPACITY,
    SHIELD_INDICATOR_WIDTH,
    SHIELD_INDICATOR_HEIGHT,
    SHIELD_INDICATOR_COLOR,
    SHIELD_INDICATOR_BG_COLOR,
    BOOST_SPEED_MULTIPLIER,
    BOOST_DURATION,
    BOOST_COOLDOWN,
    BOOST_DOUBLE_TAP_WINDOW,
    BOOST_INDICATOR_WIDTH,
    BOOST_INDICATOR_HEIGHT,
    BOOST_INDICATOR_COLOR,
    SLOWDOWN_DURATION,
    TICK_RATE,
    INTERPOLATION_FACTOR,
    SPARK_COUNT,
    SPARK_SPREAD_ANGLE,
    SPARK_DISTANCE,
    SPARK_VELOCITY,
    SPARK_LIFETIME,
    SPARK_VELOCITY_INCREASE
};
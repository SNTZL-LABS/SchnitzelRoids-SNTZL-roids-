// background-renderer.js

function drawBackgroundMap(ctx, gameState, CANVAS_WIDTH, CANVAS_HEIGHT, isLoggedIn) {
    if (isLoggedIn) {
        // If logged in, don't draw the background map
        return;
    }

    // Clear canvas with a semi-transparent black
    ctx.fillStyle = 'rgba(11, 0, 6, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Use default values if GAME_WIDTH and GAME_HEIGHT are not defined yet
    const GAME_WIDTH = gameState.width || 4000;
    const GAME_HEIGHT = gameState.height || 4000;

    const mapScale = Math.max(CANVAS_WIDTH / GAME_WIDTH, CANVAS_HEIGHT / GAME_HEIGHT);
    const mapOffsetX = (CANVAS_WIDTH - GAME_WIDTH * mapScale) / 2;
    const mapOffsetY = (CANVAS_HEIGHT - GAME_HEIGHT * mapScale) / 2;

    // Draw asteroids
    gameState.asteroids.forEach(asteroid => {
        ctx.fillStyle = asteroid.size === 'stnzl' ? 'rgba(255, 153, 51, 0.7)' : 'rgba(255, 234, 176, 0.2)';
        ctx.beginPath();
        ctx.arc(
            asteroid.pos.x * mapScale + mapOffsetX,
            asteroid.pos.y * mapScale + mapOffsetY,
            asteroid.radius * mapScale,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    // Draw players
    Object.values(gameState.players).forEach(player => {
        ctx.save();
        ctx.translate(player.pos.x * mapScale + mapOffsetX, player.pos.y * mapScale + mapOffsetY);
        ctx.rotate(player.angle);

        ctx.strokeStyle = player.dead ? 'rgba(68, 68, 68, 0.5)' : 'rgba(255, 234, 176, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-2.5, 2.5);
        ctx.lineTo(-2.5, -2.5);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    });
}

// Make function globally available
window.drawBackgroundMap = drawBackgroundMap;
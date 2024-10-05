// game-renderer.js

// Preload the font
document.fonts.load('20px "PressStart2P"').then(() => {
    // Font loaded
});

function drawGame(ctx, gameState, currentPlayer, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, socket) {
    // Clear canvas
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Set the camera to follow the current player
    const cameraX = currentPlayer.pos.x - VIEWPORT_WIDTH / 2;
    const cameraY = currentPlayer.pos.y - VIEWPORT_HEIGHT / 2;

    // Draw game objects
    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    Object.values(gameState.players).forEach(player => {
        if (player.pos.x >= cameraX - 50 && player.pos.x <= cameraX + VIEWPORT_WIDTH + 50 &&
            player.pos.y >= cameraY - 50 && player.pos.y <= cameraY + VIEWPORT_HEIGHT + 50) {
            drawPlayer(ctx, player, player.id === socket.id);

            // Draw bullets for each player
            player.bullets.forEach(bullet => {
                if (bullet.pos.x >= cameraX && bullet.pos.x <= cameraX + VIEWPORT_WIDTH &&
                    bullet.pos.y >= cameraY && bullet.pos.y <= cameraY + VIEWPORT_HEIGHT) {
                    drawBullet(ctx, bullet);
                }
            });
        }
    });

    gameState.asteroids.forEach(asteroid => {
        if (asteroid.pos.x >= cameraX - asteroid.radius && asteroid.pos.x <= cameraX + VIEWPORT_WIDTH + asteroid.radius &&
            asteroid.pos.y >= cameraY - asteroid.radius && asteroid.pos.y <= cameraY + VIEWPORT_HEIGHT + asteroid.radius) {
            drawAsteroid(ctx, asteroid);
        }
    });

    ctx.restore();

    // Draw STNZL count
    drawSTNZLCount(ctx, currentPlayer.collectedSTNZL, VIEWPORT_WIDTH);

    // Draw shield indicator
    drawShieldIndicator(ctx, currentPlayer, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Draw boost indicator
    drawBoostIndicator(ctx, currentPlayer, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Draw ETH address information
    drawETHAddressInfo(ctx, currentPlayer, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
}

// Make functions globally available
window.drawGame = drawGame;
window.drawMinimap = drawMinimap;
window.drawBackgroundMap = drawBackgroundMap;
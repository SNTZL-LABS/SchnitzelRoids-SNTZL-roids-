// minimap-renderer.js

function drawMinimap(minimapCtx, gameState, currentPlayer, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, socket) {
    const minimapCanvas = minimapCtx.canvas;
    minimapCtx.fillStyle = '#0b0006';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    // Add glow effect to minimap border
    minimapCtx.shadowColor = 'rgba(187, 62, 62, 1)'; // #bb3e3e
    minimapCtx.shadowBlur = 24; // 24px size
    minimapCtx.shadowOffsetX = 0;
    minimapCtx.shadowOffsetY = 0;

    minimapCtx.strokeStyle = '#ffeab0';
    minimapCtx.lineWidth = 2;
    minimapCtx.strokeRect(0, 0, minimapCanvas.width, minimapCanvas.height);

    // Use global GAME_WIDTH and GAME_HEIGHT
    const GAME_WIDTH = window.GAME_WIDTH || 4000;
    const GAME_HEIGHT = window.GAME_HEIGHT || 4000;

    const minimapScale = Math.min(minimapCanvas.width / GAME_WIDTH, minimapCanvas.height / GAME_HEIGHT);
    const minimapOffsetX = (minimapCanvas.width - GAME_WIDTH * minimapScale) / 2;
    const minimapOffsetY = (minimapCanvas.height - GAME_HEIGHT * minimapScale) / 2;

    // Draw players on minimap
    Object.values(gameState.players).forEach(player => {
        minimapCtx.fillStyle = player.id === socket.id ? '#0f0' : (player.dead ? '#444' : '#ffeab0');
        minimapCtx.fillRect(
            player.pos.x * minimapScale + minimapOffsetX,
            player.pos.y * minimapScale + minimapOffsetY,
            3,
            3
        );
    });

    // Draw only STNZL-asteroids on minimap
    gameState.asteroids.forEach(asteroid => {
        if (asteroid.size === 'stnzl') {
            minimapCtx.fillStyle = '#f93';
            minimapCtx.fillRect(
                asteroid.pos.x * minimapScale + minimapOffsetX,
                asteroid.pos.y * minimapScale + minimapOffsetY,
                2,
                2
            );
        }
    });

    // Draw current player's viewport on minimap
    minimapCtx.strokeStyle = '#ffeab0';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(
        (currentPlayer.pos.x - VIEWPORT_WIDTH / 2) * minimapScale + minimapOffsetX,
        (currentPlayer.pos.y - VIEWPORT_HEIGHT / 2) * minimapScale + minimapOffsetY,
        VIEWPORT_WIDTH * minimapScale,
        VIEWPORT_HEIGHT * minimapScale
    );

    // Reset shadow at the end of all drawing operations
    minimapCtx.shadowColor = 'transparent';
    minimapCtx.shadowBlur = 0;
}

// Make function globally available
window.drawMinimap = drawMinimap;
// player-renderer.js

function drawPlayer(ctx, player, isCurrentPlayer = false) {
    ctx.save();
    ctx.translate(player.pos.x, player.pos.y);
    ctx.rotate(player.angle);

    // Draw shield if active
    if (player.shieldActive) {
        ctx.strokeStyle = 'rgba(187, 62, 62, 1)'; // Constant opacity
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.shieldRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Add a glow effect
        ctx.shadowColor = 'rgba(187, 62, 62, 1)';
        ctx.shadowBlur = 10;
    }

    // Draw ship (simple triangle, stroked instead of filled)
    if (player.dead) {
        ctx.strokeStyle = '#444'; // Dark grey for dead players
    } else {
        ctx.strokeStyle = isCurrentPlayer ? '#0f0' : '#ffeab0';
    }
    ctx.lineWidth = 2;

    // Add glow effect to the spaceship
    ctx.shadowColor = 'rgba(187, 62, 62, 1)'; // #bb3e3e 
    ctx.shadowBlur = 24; // 24px size
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.stroke();

    // Reset shadow properties
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw thrust (also called flame or exhaust)
    if (player.thrust && !player.dead) {
        // Add glow effect to the thrust
        ctx.shadowColor = 'rgba(255, 153, 51, 0.8)'; // Slightly transparent orange
        ctx.shadowBlur = 20; // Slightly smaller blur than the spaceship

        ctx.fillStyle = '#f93'; // Keep the same color for normal and boost speed
        ctx.beginPath();
        const normalFlameLength = 25; // Increased normal flame length
        const flameLength = player.isBoosting ? normalFlameLength * 1.5 : normalFlameLength;
        ctx.moveTo(-flameLength, 0);
        ctx.lineTo(-10, 6);
        ctx.lineTo(-10, -6);
        ctx.closePath();
        ctx.fill();

        // Reset shadow properties
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    ctx.restore();

    // Draw sparks only during boost speed
    if (player.isBoosting) {
        drawSparks(ctx, player);
    }
}

function drawSparks(ctx, player) {
    const currentTime = Date.now();
    const exhaustColor = { r: 255, g: 153, b: 51 }; // #f93 for both normal and boost

    player.sparks.forEach(spark => {
        const age = currentTime - spark.createdAt;
        if (age <= 1000) { // Only draw sparks that are less than 1000 milliseconds old
            const opacity = 0.25 - age / 1000; // Fade out over 1000 milliseconds
            const size = 1 + (1 - opacity) * 2; // Increase size as it fades out
            
            // Fade the color from the exhaust color to transparent
            const r = exhaustColor.r;
            const g = exhaustColor.g;
            const b = exhaustColor.b;
            
            // Add glow effect to the sparks
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`; // Slightly less opaque than the spark itself
            ctx.shadowBlur = 5 + (1 - opacity) * 10; // Increase blur as the spark fades out
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.beginPath();
            ctx.arc(spark.pos.x, spark.pos.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset shadow properties
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    });
}

// Make functions globally available
window.drawPlayer = drawPlayer;
window.drawSparks = drawSparks;
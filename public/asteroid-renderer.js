// asteroid-renderer.js

function drawAsteroid(ctx, asteroid) {
    ctx.save();
    ctx.translate(asteroid.pos.x, asteroid.pos.y);

    if (asteroid.size === 'stnzl') {
        // Draw STNZL-asteroid 50% bigger
        const img = new Image();
        img.src = `/images/SNTZL_ASTEROID_${asteroid.variant}.png`;
        const scaleFactor = 1.5; // 50% bigger
        const newSize = asteroid.radius * 2 * scaleFactor;
        const offset = (newSize - asteroid.radius * 2) / 2;
        ctx.drawImage(img, -asteroid.radius - offset, -asteroid.radius - offset, newSize, newSize);
    } else {
        // Draw regular asteroid with glow effect
        ctx.strokeStyle = '#ffeab0';
        switch(asteroid.size) {
            case 'large':
                ctx.lineWidth = 4;
                break;
            case 'medium':
                ctx.lineWidth = 3;
                break;
            case 'small':
                ctx.lineWidth = 2;
                break;
            default:
                ctx.lineWidth = 2;
        }

        // Add glow effect
        ctx.shadowColor = 'rgba(187, 62, 62, 1)'; // #bb3e3e 
        ctx.shadowBlur = 24; // 24px size
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Reset shadow properties
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    ctx.restore();
}

// Make function globally available
window.drawAsteroid = drawAsteroid;
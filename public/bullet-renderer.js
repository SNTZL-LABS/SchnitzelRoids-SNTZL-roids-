// bullet-renderer.js

function drawBullet(ctx, bullet) {
    ctx.save();
    
    // Add glow effect
    ctx.shadowColor = 'rgba(187, 62, 62, 1)'; // #bb3e3e 
    ctx.shadowBlur = 24; // 24px size
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#ffeab0';  // bullet color
    ctx.beginPath();
    ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow properties
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.restore();
}

// Make function globally available
window.drawBullet = drawBullet;
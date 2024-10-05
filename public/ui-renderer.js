// ui-renderer.js

// Load the STNZL image once
const stnzlImage = new Image();
stnzlImage.src = '/images/SNTZL_ASTEROIDS_COLLECTED.gif';

// Store the original aspect ratio of the image
let stnzlImageAspectRatio;
stnzlImage.onload = () => {
    stnzlImageAspectRatio = stnzlImage.width / stnzlImage.height;
};

function drawSTNZLCount(ctx, count, VIEWPORT_WIDTH) {
    ctx.save();
    ctx.font = '30px "PressStart2P"';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';

    const text = `${count} x `;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

    // Calculate image dimensions
    const imageHeight = textHeight;
    const imageWidth = imageHeight * stnzlImageAspectRatio;

    const totalWidth = textWidth + imageWidth;
    const startX = (VIEWPORT_WIDTH - totalWidth) / 2;
    const baselineY = 40; // Adjust this value to position the text and image vertically

    // Draw the count text
    ctx.fillText(text, startX + textWidth, baselineY);

    // Draw the GIF image
    ctx.drawImage(stnzlImage, startX + textWidth, baselineY - imageHeight - 15, imageWidth * 2, imageHeight * 2);

    ctx.restore();
}

function drawShieldIndicator(ctx, player, VIEWPORT_WIDTH, VIEWPORT_HEIGHT) {
    const indicatorWidth = 100;
    const indicatorHeight = 20;
    const padding = 10;
    const x = VIEWPORT_WIDTH - indicatorWidth - padding;
    const y = VIEWPORT_HEIGHT - indicatorHeight - padding;

    ctx.save();

    // Add glow effect
    ctx.shadowColor = 'rgba(187, 62, 62, 0.5)'; // #bb3e3e
    ctx.shadowBlur = 24; // 24px size
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw background
    ctx.fillStyle = 'rgba(11, 0, 6, 1)';
    ctx.fillRect(x, y, indicatorWidth, indicatorHeight);

    // Draw progress bar
    ctx.fillStyle = 'rgba(255, 234, 176, 1)';
    ctx.fillRect(x, y, indicatorWidth * player.shieldCooldownProgress, indicatorHeight);

    // Draw text
    ctx.font = '14px "PressStart2P"';
    ctx.fillStyle = '#ffeab0';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('SHIELD', x - 5, y + indicatorHeight / 2);

    ctx.restore();
}

function drawBoostIndicator(ctx, player, VIEWPORT_WIDTH, VIEWPORT_HEIGHT) {
    const indicatorWidth = 100;
    const indicatorHeight = 20;
    const padding = 10;
    const x = VIEWPORT_WIDTH - indicatorWidth - padding;
    const y = VIEWPORT_HEIGHT - (indicatorHeight * 2) - (padding * 2) - 5; // Position above shield indicator

    ctx.save();

    // Add glow effect
    ctx.shadowColor = 'rgba(187, 62, 62, 0.5)'; // #bb3e3e 
    ctx.shadowBlur = 24; // 24px size
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw background
    ctx.fillStyle = 'rgba(51, 51, 51, 0.7)';
    ctx.fillRect(x, y, indicatorWidth, indicatorHeight);

    // Draw progress bar
    ctx.fillStyle = player.isBoosting ? 'rgba(255, 255, 0, 0)' : 'rgba(255, 234, 176, 1)'; // Yellow when boosting, orange otherwise
    ctx.fillRect(x, y, indicatorWidth * player.boostCooldownProgress, indicatorHeight);

    // Draw text
    ctx.font = '14px "PressStart2P"';
    ctx.fillStyle = '#ffeab0';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('BOOST', x - 5, y + indicatorHeight / 2);

    ctx.restore();
}

function drawETHAddressInfo(ctx, player, VIEWPORT_WIDTH, VIEWPORT_HEIGHT) {
    ctx.save();

    // Add glow effect
    ctx.shadowColor = 'rgba(187, 62, 62, 0.5)'; // #bb3e3e 
    ctx.shadowBlur = 24; // 24px size
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = '10px "PressStart2P"';
    ctx.fillStyle = '#ffeab0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    const staticText = "Deposit Address - HighScore Prizes";
    ctx.fillText(staticText, VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 40);

    let addressText;
    if (player.ethereumAddress) {
        // Display truncated address
        const truncatedAddress = player.ethereumAddress.slice(0, 6) + '...' + player.ethereumAddress.slice(-4);
        addressText = truncatedAddress;
    } else {
        addressText = "Not Connected";
    }

    ctx.fillText(addressText, VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT - 20);

    ctx.restore();
}

// Make functions globally available
window.drawSTNZLCount = drawSTNZLCount;
window.drawShieldIndicator = drawShieldIndicator;
window.drawBoostIndicator = drawBoostIndicator;
window.drawETHAddressInfo = drawETHAddressInfo;
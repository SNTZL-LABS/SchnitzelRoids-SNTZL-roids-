// hitmarker.js

class Hitmarker {
    constructor(x, y, points, color = '#ffeab0') {
        this.x = x;
        this.y = y;
        this.points = points;
        this.color = color;
        this.opacity = 1;
        this.lifetime = 1000; // milliseconds
        this.createdAt = Date.now();
    }

    update() {
        const elapsedTime = Date.now() - this.createdAt;
        this.opacity = 1 - (elapsedTime / this.lifetime);
        this.y -= 0.5; // Move upwards slowly
    }

    isExpired() {
        return Date.now() - this.createdAt > this.lifetime;
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`+${this.points}`, this.x, this.y);
        ctx.restore();
    }
}

class HitmarkerManager {
    constructor() {
        this.hitmarkers = [];
    }

    addHitmarker(x, y, points, color) {
        this.hitmarkers.push(new Hitmarker(x, y, points, color));
    }

    update() {
        this.hitmarkers.forEach(hitmarker => hitmarker.update());
        this.hitmarkers = this.hitmarkers.filter(hitmarker => !hitmarker.isExpired());
    }

    render(ctx) {
        this.hitmarkers.forEach(hitmarker => hitmarker.render(ctx));
    }
}

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    window.HitmarkerManager = HitmarkerManager;
} else {
    // We're in Node.js
    module.exports = { HitmarkerManager };
}
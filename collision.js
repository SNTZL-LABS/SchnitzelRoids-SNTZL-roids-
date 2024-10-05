function checkCollision(obj1, obj2) {
    if (!obj1 || !obj2 || !obj1.pos || !obj2.pos || 
        typeof obj1.pos.x !== 'number' || typeof obj1.pos.y !== 'number' ||
        typeof obj2.pos.x !== 'number' || typeof obj2.pos.y !== 'number' ||
        typeof obj1.radius !== 'number' || typeof obj2.radius !== 'number') {
        return false;
    }

    const dx = obj1.pos.x - obj2.pos.x;
    const dy = obj1.pos.y - obj2.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
}

module.exports = { checkCollision };
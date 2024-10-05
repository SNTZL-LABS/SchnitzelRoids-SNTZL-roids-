// input-handler.js

const keys = {};
let lastUpKeyPress = 0;
let boostActive = false;
let upKeyReleased = true;

function setupInputHandlers(socket) {
    document.addEventListener('keydown', (e) => handleKeyDown(e, socket));
    document.addEventListener('keyup', (e) => handleKeyUp(e, socket));
}

function handleKeyDown(e, socket) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        keys[e.code] = true;
        
        if (e.code === 'ArrowUp' && upKeyReleased) {
            const now = Date.now();
            if (now - lastUpKeyPress <= 300) { // 300ms window for double-tap
                boostActive = true;
            }
            lastUpKeyPress = now;
            upKeyReleased = false;
        }
        
        sendInput(socket);
        e.preventDefault();
    }
}

function handleKeyUp(e, socket) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        keys[e.code] = false;
        
        if (e.code === 'ArrowUp') {
            upKeyReleased = true;
            // Reset boost after a short delay to allow for double-tap detection
            setTimeout(() => {
                if (upKeyReleased) {
                    boostActive = false;
                    sendInput(socket);
                }
            }, 50);
        } else {
            sendInput(socket);
        }
        
        e.preventDefault();
    }
}

function sendInput(socket) {
    socket.emit('input', {
        left: keys['ArrowLeft'],
        right: keys['ArrowRight'],
        up: keys['ArrowUp'],
        shield: keys['ArrowDown'],
        shoot: keys['Space'],
        boost: boostActive
    });
}

// Export the setup function
window.setupInputHandlers = setupInputHandlers;
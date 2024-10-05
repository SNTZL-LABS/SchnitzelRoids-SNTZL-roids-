// CanvasManager.js

const CanvasManager = {
    elements: null,

    init() {
        this.elements = {
            canvas: document.getElementById('gameCanvas'),
            backgroundCanvas: document.getElementById('backgroundCanvas'),
            minimapCanvas: document.getElementById('minimap').querySelector('canvas')
        };

        if (!this.elements.minimapCanvas) {
            this.elements.minimapCanvas = document.createElement('canvas');
            document.getElementById('minimap').appendChild(this.elements.minimapCanvas);
        }

        if (this.elements.canvas) {
            this.elements.ctx = this.elements.canvas.getContext('2d');
        }
        if (this.elements.backgroundCanvas) {
            this.elements.backgroundCtx = this.elements.backgroundCanvas.getContext('2d');
        }
        if (this.elements.minimapCanvas) {
            this.elements.minimapCtx = this.elements.minimapCanvas.getContext('2d');
        }

        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
    },

    resizeCanvases() {
        if (this.elements.canvas) {
            this.elements.canvas.width = window.innerWidth;
            this.elements.canvas.height = window.innerHeight;
        }
        if (this.elements.backgroundCanvas) {
            this.elements.backgroundCanvas.width = window.innerWidth;
            this.elements.backgroundCanvas.height = window.innerHeight;
        }
        if (this.elements.minimapCanvas) {
            this.elements.minimapCanvas.width = 150;
            this.elements.minimapCanvas.height = 150;
        }
    },

    updateGame(gameState, currentPlayer, hitmarkerManager, isLoggedIn) {
        this.updateBackgroundMap(gameState, isLoggedIn);
        if (currentPlayer && this.elements.canvas && this.elements.ctx) {
            const cameraX = currentPlayer.pos.x - this.elements.canvas.width / 2;
            const cameraY = currentPlayer.pos.y - this.elements.canvas.height / 2;
            
            drawGame(this.elements.ctx, gameState, currentPlayer, this.elements.canvas.width, this.elements.canvas.height, window.socket);
            
            if (this.elements.minimapCtx && this.elements.minimapCanvas) {
                // Removed clearRect call
                drawMinimap(
                    this.elements.minimapCtx,
                    gameState,
                    currentPlayer,
                    this.elements.canvas.width,
                    this.elements.canvas.height,
                    window.socket
                );
            }
            
            this.renderHitmarkers(hitmarkerManager, currentPlayer);
        }
    },

    updateBackgroundMap(gameState, isLoggedIn) {
        if (this.elements.backgroundCtx && this.elements.backgroundCanvas) {
            drawBackgroundMap(this.elements.backgroundCtx, gameState, this.elements.backgroundCanvas.width, this.elements.backgroundCanvas.height, isLoggedIn);
        }
    },

    renderHitmarkers(hitmarkerManager, currentPlayer) {
        if (hitmarkerManager && currentPlayer && this.elements.ctx && this.elements.canvas) {
            const ctx = this.elements.ctx;
            const cameraX = currentPlayer.pos.x - this.elements.canvas.width / 2;
            const cameraY = currentPlayer.pos.y - this.elements.canvas.height / 2;
            ctx.save();
            ctx.translate(-cameraX, -cameraY);
            hitmarkerManager.render(ctx);
            ctx.restore();
        }
    }
};

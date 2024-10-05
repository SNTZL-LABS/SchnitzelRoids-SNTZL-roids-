// PlayerManager.js

const PlayerManager = {
    elements: null,
    badgeImages: {},
    activePlayersData: null,

    init(elements) {
        this.elements = elements;
        this.preloadBadgeImages();
    },

    preloadBadgeImages() {
        const badgeNames = ['METAMASK_BADGE', 'SNTZL_ASTEROID_A', 'SNTZL_ASTEROID_B', 'SNTZL_ASTEROID_C', 'SNTZL_ASTEROID_D'];
        badgeNames.forEach(name => {
            const img = new Image();
            img.src = `/images/${name}.png`;
            this.badgeImages[name] = img;
        });
    },

    getBadgeForBalance(balance) {
        if (balance >= 500) return this.badgeImages['SNTZL_ASTEROID_D'];
        if (balance >= 250) return this.badgeImages['SNTZL_ASTEROID_C'];
        if (balance >= 50) return this.badgeImages['SNTZL_ASTEROID_B'];
        if (balance >= 1) return this.badgeImages['SNTZL_ASTEROID_A'];
        return this.badgeImages['METAMASK_BADGE'];
    },

    updateScore(score) {
        this.elements.scoreElement.textContent = score;
    },

    updateActivePlayers() {
        let activePlayersData;
        if (this.activePlayersData && this.activePlayersData.scores) {
            activePlayersData = this.activePlayersData.scores.slice(0, 8);
        } else {
            activePlayersData = [];
        }

        this.elements.activePlayersList.innerHTML = `
            ${activePlayersData.map((player) => {
                const badge = player.ethereumAddress ? this.getBadgeForBalance(player.sntzlBalance) : null;
                const truncatedName = player.name.length > 12 ? player.name.slice(0, 12) + '...' : player.name;
                return `
                    <li style="display: grid; grid-template-columns: 1fr 80px 30px; gap: 10px; padding: 5px 0;">
                        <span>${truncatedName}</span>
                        <span style="text-align: right;">${player.score}</span>
                        <span>${badge ? `<img src="${badge.src}" alt="Player Badge" style="width: 20px; height: 20px;">` : ''}</span>
                    </li>
                `;
            }).join('')}
        `;
    },

    updateEthereumAddress(address) {
        this.elements.ethereumAddressElement.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
        this.updateConnectMetamaskButton(address);
    },

    updateConnectMetamaskButton(address) {
        const isConnected = !!address;
        this.elements.connectMetamaskButton.disabled = isConnected;
        this.elements.connectMetamaskPopupButton.disabled = isConnected;
        
        if (isConnected) {
            this.elements.connectMetamaskButton.textContent = 'MetaMask Connected';
            this.elements.connectMetamaskPopupButton.textContent = 'MetaMask Connected';
        } else {
            this.elements.connectMetamaskButton.textContent = 'Connect MetaMask (optional)';
            this.elements.connectMetamaskPopupButton.textContent = 'Connect MetaMask';
        }
    },

    updateActivePlayersBoard(activePlayersData) {
        this.activePlayersData = activePlayersData;
        this.updateActivePlayers();
    }
};

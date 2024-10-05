// PopupManager.js

const PopupManager = {
    elements: null,
    highScoresData: null,
    badgeImages: {},
    baseZIndex: 1000,

    init(elements) {
        this.elements = elements;
        this.preloadBadgeImages();
        this.addEventListeners();
    },

    preloadBadgeImages() {
        const badgeNames = ['METAMASK_BADGE', 'SNTZL_ASTEROID_A', 'SNTZL_ASTEROID_B', 'SNTZL_ASTEROID_C', 'SNTZL_ASTEROID_D'];
        badgeNames.forEach(name => {
            const img = new Image();
            img.src = `/images/${name}.png`;
            this.badgeImages[name] = img;
        });
    },

    addEventListeners() {
        const expandLink = document.getElementById('expand-highscores');
        if (expandLink) {
            expandLink.addEventListener('click', this.openFullHighScores.bind(this));
        }
    },

    getBadgeForBalance(balance) {
        if (balance >= 500) return this.badgeImages['SNTZL_ASTEROID_D'];
        if (balance >= 250) return this.badgeImages['SNTZL_ASTEROID_C'];
        if (balance >= 50) return this.badgeImages['SNTZL_ASTEROID_B'];
        if (balance >= 1) return this.badgeImages['SNTZL_ASTEROID_A'];
        return this.badgeImages['METAMASK_BADGE'];
    },

    showDeathPopup(playerStats, highScoresData) {
        this.highScoresData = highScoresData;
        const finalScoreElement = document.getElementById('final-score');
        
        if (playerStats && playerStats.finalScore !== undefined) {
            finalScoreElement.textContent = playerStats.finalScore;
        } else {
            finalScoreElement.textContent = 'N/A';
        }

        const highScoresList = document.getElementById('high-scores-list');
        highScoresList.innerHTML = this.generateHighScoresHTML(highScoresData);

        this.updateConnectMetamaskButton();

        this.elements.deathPopup.style.display = 'flex';
        this.elements.deathPopup.style.zIndex = this.baseZIndex + 2;
        document.getElementById('restart-button').focus();
    },

    generateHighScoresHTML(highScoresData) {
        return `
            <table style="width:100%; border-collapse: collapse;">
                ${highScoresData.scores.slice(0, 10).map((score, index) => {
                    const prize = highScoresData.prizes.find(p => p.position === score.position);
                    const badge = score.ethereumAddress ? this.getBadgeForBalance(score.sntzlBalance) : null;
                    return `
                        <tr>
                            <td style="text-align: center; padding-right: 10px;">${prize ? prize.prize : ' '}</td>
                            <td style="text-align: center; padding-right: 10px;">${score.position}.</td>
                            <td style="text-align: left; padding-right: 10px;">
                                ${badge ? `<img src="${badge.src}" alt="Player Badge" style="width: 20px; height: 20px; vertical-align: middle;">` : ''}
                            </td>
                            <td style="text-align: left; padding-right: 10px;">${score.name}</td>
                            <td style="text-align: right;">${score.score}</td>
                        </tr>
                    `;
                }).join('')}
            </table>
        `;
    },

    hideDeathPopup() {
        this.elements.deathPopup.style.display = 'none';
    },

    updateHighScores(highScoresData) {
        this.highScoresData = highScoresData;
    },

    openFullHighScores(event) {
        event.preventDefault();
        window.open('full-highscores.html', '_blank', 'width=800,height=600');
    },

    async showSntzlPopup() {
        try {
            const response = await fetch('sntzl-popup.html');
            let content = await response.text();
            
            document.getElementById('sntzl-popup-content').innerHTML = content;
            this.elements.sntzlPopup.style.display = 'block';
            this.elements.sntzlPopup.style.zIndex = this.baseZIndex + 1;
            
            // Ensure SNTZL popup is above INFO popup
            if (this.elements.infoPopup.style.display === 'block') {
                this.elements.infoPopup.style.zIndex = this.baseZIndex;
            }
        } catch (error) {
            // Error handling without logging
        }
    },

    async showInfoPopup() {
        try {
            const response = await fetch('info-popup.html');
            const content = await response.text();
            document.getElementById('info-popup-content').innerHTML = content;
            this.elements.infoPopup.style.display = 'block';
            this.elements.infoPopup.style.zIndex = this.baseZIndex;
            
            // Ensure SNTZL popup is above INFO popup if it's open
            if (this.elements.sntzlPopup.style.display === 'block') {
                this.elements.sntzlPopup.style.zIndex = this.baseZIndex + 1;
            }
        } catch (error) {
            // Error handling without logging
        }
    },

    hidePopups() {
        this.elements.sntzlPopup.style.display = 'none';
        this.elements.infoPopup.style.display = 'none';
    },

    copyToClipboard(text, button) {
        const copyText = (text) => {
            return new Promise((resolve, reject) => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(resolve, reject);
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";  // Avoid scrolling to bottom
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();

                    try {
                        document.execCommand('copy');
                        resolve();
                    } catch (err) {
                        reject(err);
                    }

                    document.body.removeChild(textArea);
                }
            });
        };

        copyText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }).catch((err) => {
            button.textContent = 'Error!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    },

    updateConnectMetamaskButton() {
        // This method needs to be implemented or removed if not needed
    }
};

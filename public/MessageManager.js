// MessageManager.js

const MessageManager = {
    messageContainer: null,
    messageTimeout: null,

    init(messageContainer) {
        this.messageContainer = messageContainer;
    },

    showMessage(message, isError = false, duration = 5000) {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        this.messageContainer.textContent = message;
        this.messageContainer.style.display = 'block';
        this.messageContainer.className = isError ? 'error' : 'success';
        this.messageTimeout = setTimeout(() => {
            this.hideMessage();
        }, duration);
    },

    hideMessage() {
        this.messageContainer.style.display = 'none';
    }
};

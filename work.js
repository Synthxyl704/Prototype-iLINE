document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.getElementById('chat-area');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const activeList = document.getElementById('active-list');

    // LOCAL_STORAGE_KEY
    const LOCAL_STORAGE_KEY = 'syncLink_x';

    function loadMessages() {
        const storedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        storedMessages.forEach(msg => displayMessage(msg.text, msg.timestamp));
    }

    function displayMessage(text, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';

        const time = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                               : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.innerHTML = `${text}<span class="timestamp">${time}</span>`;
        
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function sendMessage() {
        // <input type="text" class="chat-input" id="chat-input" placeholder="Type some shit...">
        const messageText = chatInput.value.trim();
        if (!messageText) { return; } // doesnt actually do anything in case empty [[ 0x9C ]]

        const ISO_DATE_FORMAT = new Date().toISOString(); // ISO 8601 format
        displayMessage(messageText, ISO_DATE_FORMAT);

        const storedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

        storedMessages.push({ 
            text: messageText, 
            timestamp: ISO_DATE_FORMAT 
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedMessages));

        chatInput.value = ''; // Clear input
    }

    // Event listener for send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for Enter key
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Load messages on page load
    loadMessages();

    // Placeholder for active users (no dynamic population in this prototype)
});
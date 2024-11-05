const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display the user's message
    displayMessage(userMessage, 'user-message');
    userInput.value = '';

    // Send the message to the backend
    try {
        const response = await fetch('http://127.0.0.1:8000/api/chatbot/chatbot/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayMessage(data.bot_response, 'bot-message');
    } catch (error) {
        console.error('Error:', error);
        displayMessage('Sorry, there was an error processing your request.', 'bot-message');
    }
}

function displayMessage(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
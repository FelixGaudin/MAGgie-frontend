document.addEventListener('DOMContentLoaded', function () {
    let waitingForResponse = false;

    function getNewToken() {
        return fetch('/generate_token')
            .then(response => response.json())
            .then(data => {
                window.token = data.token;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du token:', error);
            });
    }

    function sendMessage(message) {
        if (waitingForResponse) {
            return;
        }

        waitingForResponse = true;
        var sendButton = document.getElementById("sendButton")
        sendButton.disabled = true;
        appendMessage('Vous', 'user-message', message);

        appendMessage('MAGgie', 'bot-message loading-message', 'Je suis en train de traiter votre demande...');

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'NomDuModèle',
                userId: window.token,
                message: message,
                fromWeb: true
            })
        })
            .then(response => response.json())
            .then(data => {
                sendButton.disabled = false;
                waitingForResponse = false;

                var loadingMessages = document.querySelectorAll('.loading-message');
                loadingMessages.forEach(function (loadingMessage) {
                    loadingMessage.remove();
                });

                var chatBox = document.getElementById('chatBox');

                console.log(data);
                if (data.status === 'success') {
                    appendMessage('MAGgie', 'bot-message', data.message, chatBox);
                } else {
                    console.error('Erreur lors de la requête:', data.message);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    }

    function appendMessage(author, className, message, chatBox) {
        chatBox = chatBox || document.getElementById('chatBox');
        if (!chatBox) {
            console.error('La chatBox est null');
            return;
        }
        var messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = `${author} : ${message}`;
        chatBox.appendChild(messageDiv);
    }

    getNewToken()
        .then(() => {
            document.getElementById('messageForm').addEventListener('submit', function (event) {
                event.preventDefault();
                var userInput = document.getElementById('userInput').value;

                sendMessage(userInput);

                document.getElementById('userInput').value = '';
            });
        });
});

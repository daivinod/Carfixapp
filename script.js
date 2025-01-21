document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const cameraBtn = document.getElementById('camera-btn');

    // Function to add a message to the chat
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Function to handle sending text messages
    sendBtn.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            chatInput.value = '';

            // Simulate AI response (replace with actual API call)
            const aiResponse = await getAIResponse(userMessage);
            addMessage('ai', aiResponse);
        }
    });

    // Function to handle camera input
    cameraBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*, video/*';
        input.capture = 'environment'; // Use the rear camera on mobile devices
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileType = file.type.startsWith('image') ? 'image' : 'video';
                addMessage('user', `Uploaded ${fileType}: ${file.name}`);

                // Simulate AI response (replace with actual API call)
                const aiResponse = await getAIResponseFromMedia(file);
                addMessage('ai', aiResponse);
            }
        };
        input.click();
    });

    async function getAIResponse(message) {
        const response = await fetch('https://api.deepseek.com/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-a97b351b34d74962a9356f44bc523abd'
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 150
            })
        });
        const data = await response.json();
        return data.choices[0].text;
    }
    
    async function getAIResponseFromMedia(file) {
        const formData = new FormData();
        formData.append('file', file);
    
        const response = await fetch('https://api.deepseek.com/v1/analyze', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk-a97b351b34d74962a9356f44bc523abd'
            },
            body: formData
        });
        const data = await response.json();
        return data.analysis;
    }
});

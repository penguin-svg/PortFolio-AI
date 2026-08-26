async function sendMessage() {

    const input = document.getElementById("question");
    const chatBox = document.getElementById("chat-box");

    const question = input.value.trim();

    if (!question) {
        return;
    }

    // Show user's message
    chatBox.innerHTML += `
        <div class="user-message">
            <b>You:</b> ${question}
        </div>
    `;

    input.value = "";

    // Create empty AI message
    const aiMessage = document.createElement("div");

    aiMessage.className = "ai-message";

    aiMessage.innerHTML = `
        <b>AI:</b> 
        <span class="ai-text"></span>
    `;

    chatBox.appendChild(aiMessage);

    const aiText = aiMessage.querySelector(".ai-text");

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const reader = response.body.getReader();

        const decoder = new TextDecoder();

        while (true) {

            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            const chunk = decoder.decode(value, {
                stream: true
            });

            aiText.textContent += chunk;

            chatBox.scrollTop = chatBox.scrollHeight;
        }

    } catch (error) {

        aiText.textContent =
            "Sorry, something went wrong.";

        console.error(error);
    }
}
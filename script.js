const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function addMessage(message, className) {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user-message");

  userInput.value = "";

  addMessage("⚡ Thinking...", "bot-message");

  try {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: "You are Ashwek AI Assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    document.querySelector(".bot-message:last-child").remove();

    addMessage(
      data.choices[0].message.content,
      "bot-message"
    );

  } catch (error) {

    document.querySelector(".bot-message:last-child").remove();

    addMessage(
      "⚠️ Error connecting to AI.",
      "bot-message"
    );
  }
}

userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

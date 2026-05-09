const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const typing = document.getElementById("typing");

function createMessage(message, sender) {

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (sender === "user") {

    messageDiv.classList.add("user-message");

    messageDiv.innerHTML = `
      <div class="bubble">${message}</div>
      <div class="avatar user-avatar">🧑</div>
    `;

  } else {

    messageDiv.classList.add("bot-message");

    messageDiv.innerHTML = `
      <div class="avatar bot-avatar">🤖</div>
      <div class="bubble">${message}</div>
    `;
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const message = userInput.value.trim();

  if (!message) return;

  createMessage(message, "user");

  userInput.value = "";

  typing.classList.remove("hidden");

  try {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

      method: "POST",

      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "Ashwek AI Assistant"
      },

      body: JSON.stringify({

        model: "inclusionai/ring-2.6-1t:free",

        messages: [
          {
            role: "system",
            content: "You are Ashwek AI Assistant. If user says hi, introduce yourself as Ashwek."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    typing.classList.add("hidden");

    if (data.error) {
      createMessage("⚠️ " + data.error.message, "bot");
      return;
    }

    createMessage(data.choices[0].message.content, "bot");

  } catch (error) {

    typing.classList.add("hidden");

    createMessage("⚠️ Error connecting to AI.", "bot");

    console.error(error);
  }
}

userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function startVoice() {

  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    userInput.value = event.results[0][0].transcript;
  };

  recognition.start();
}

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

  const thinking = document.createElement("div");

  thinking.className = "bot-message";

  thinking.innerHTML = "⚡ Thinking...";

  chatBox.appendChild(thinking);

  chatBox.scrollTop = chatBox.scrollHeight;

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

        model: "mistralai/mistral-7b-instruct:free",

        messages: [

          {

            role: "system",

            content: "You are Ashwek AI Assistant, a futuristic helpful AI chatbot."

          },

          {

            role: "user",

            content: message

          }

        ]

      })

    });

    const data = await response.json();

    console.log(data);

    thinking.remove();

    if (data.error) {

      addMessage(

        "⚠️ " + data.error.message,

        "bot-message"

      );

      return;
    }

    if (data.choices && data.choices.length > 0) {

      addMessage(

        data.choices[0].message.content,

        "bot-message"

      );

    } else {

      addMessage(

        "⚠️ No response received from AI.",

        "bot-message"

      );

    }

  } catch (error) {

    console.error(error);

    thinking.remove();

    addMessage(

      "⚠️ Error connecting to OpenRouter API.",

      "bot-message"

    );

  }
}

userInput.addEventListener("keypress", function(event) {

  if (event.key === "Enter") {

    sendMessage();

  }

});

function startVoice() {

  if (!('webkitSpeechRecognition' in window)) {

    alert('Voice recognition not supported in this browser.');

    return;

  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = 'en-US';

  recognition.onresult = function(event) {

    userInput.value = event.results[0][0].transcript;

  };

  recognition.start();
}

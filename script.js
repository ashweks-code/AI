const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function sendMessage(){
const message = userInput.value.trim();

if(!message) return;

const userDiv = document.createElement('div');
userDiv.className = 'user-message';
userDiv.innerText = message;
chatBox.appendChild(userDiv);

userInput.value = '';

setTimeout(()=>{
const botDiv = document.createElement('div');
botDiv.className = 'bot-message';
botDiv.innerText = '⚡ Ashwek AI says: I am still learning and evolving!';
chatBox.appendChild(botDiv);

chatBox.scrollTop = chatBox.scrollHeight;
},700);
}

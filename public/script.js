var socket = io();

const userNameInput = document.getElementById('userName');
const loginDiv = document.getElementById('login');
const form = document.getElementById('form');
const input = document.getElementById('input');
const receiverNameInput = document.getElementById('receiverName');
const messages = document.getElementById('messages');
const onlineUsersList = document.getElementById('onlineUsers');

function login() {
    const userName = userNameInput.value;
    if (userName) {
        socket.emit('register', userName);
        loginDiv.style.display = 'none'; // Hide login form
        onlineUsersSection.style.display = 'block'; // showing online users section
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = input.value;
    const receiverName = receiverNameInput.value;
    if (message && receiverName) {
        socket.emit('private message', { receiverName, message, senderName: userNameInput.value });
        addMessageToConversation(`To ${receiverName}: ${message}`, 'sent');
        input.value = '';
    }
});

socket.on('private message', function({ senderName, message }) {
    addMessageToConversation(`From ${senderName}: ${message}`, 'received');
});

function addMessageToConversation(message, type) {
    var item = document.createElement('li');
    item.textContent = message;
    item.classList.add(type); // 'sent' or 'received'
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

socket.on('online users', function(users) {
    onlineUsersList.innerHTML = '';
    users.forEach(userName => {
        if (userName !== userNameInput.value) {
            let userElement = document.createElement('li');
            userElement.textContent = userName;
            onlineUsersList.appendChild(userElement);
        }
    });
});

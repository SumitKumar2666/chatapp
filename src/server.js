const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const onlineUsers = {};

io.on('connection', (socket) => {
    console.log('User connected.');

    // When a user logs in with a name
    socket.on('register', (userName) => {
        onlineUsers[userName] = socket.id;
        io.emit('online users', Object.keys(onlineUsers)); // Sending updated list of online users
    });

    // Handling private messaging with contact names
    socket.on('private message', ({ senderName, receiverName, message }) => {
        if (onlineUsers[receiverName]) {
        io.to(onlineUsers[receiverName]).emit('private message', { senderName, message });
        }
    });

    socket.on('disconnect', () => {
        // Removing the user from onlineUsers
        const userName = Object.keys(onlineUsers).find(name => onlineUsers[name] === socket.id);
        delete onlineUsers[userName];
        console.log(`User ${userName} disconnected.`);
        io.emit('online users', Object.keys(onlineUsers)); // Updating list of online users
    });

    // socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    // });

    // socket.on('new user', (username) => {
    //     users[username] = socket;
    //     socket.username = username;
    //     console.log("users: ", users);
    // });

    // socket.on('private message', ({ recipient, message }) => {
    //     if(users[recipient]) {
    //       users[recipient].emit('private message', { sender: socket.username, message });
    //     }
    // });

    // socket.on('disconnect', () => {
    //     delete users[socket.username];
    //     console.log('User disconnected.');
    // });
});

server.listen(PORT,  () => {
    console.log('Server running on port: ' + PORT);
})
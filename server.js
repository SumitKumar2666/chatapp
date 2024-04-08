const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('User connected.');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected.');
    });
});

server.listen(port,  () => {
    console.log('Server running on port: ' + port);
})
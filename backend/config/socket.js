const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://appchodocutest.ddns.net:3000", // Ensure this is the correct origin for your client
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected BE');

  // Event for testing
  socket.on('testEvent', (data) => {
    // console.log('Received test event with data:', data);
    // Emit an event back to client
    socket.emit('testResponse', { message: 'Test event received successfully!', receivedData: data });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected BE');
  });
});

server.listen(4000, () => {
  console.log('Socket.io server running on port 4000');
});

module.exports = io;

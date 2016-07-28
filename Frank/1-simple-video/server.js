// Create an Express app to handle routing
// http server to handle HTTP requests
// and socket.io instance (with http server passed in)
// to handle websocket requests
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

server.listen(8000);

io.on('connection', function (socket) {
  console.log('User connected');
  
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });

  // use 'socket' to send just to the use who sent the message
  // use io.emit to broadcast to everyone
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});
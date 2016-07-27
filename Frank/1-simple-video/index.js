// var express = require('express');
// // var cors = require('cors');
// var path = require('path');
// var WebSocketServer = require('ws').Server;
// var http = require('http');

// // Create server
// var port = process.env.PORT || 8000;

// var server = express();
// server.listen(port, function() {
//   console.log('Now listening on port ', port);
// });

// // Create websocket server
// var wss = new WebSocketServer({ server: server });

// // Middleware
// // server.use(cors());
// // server.use(express.static(__dirname + '/public'));

// // Handle websocket connections
// wss.on('connection', function(connection) {
//   console.log('User connected via websocket');

//   // // Handle messages from connected user
//   // connection.on('message', function(message) {
//   //   console.log('Got message from a user:', message);
//   // });

//   // connection.send('Hello from websocket server');

//   // connection.on('close', function() {
//   //   console.log('User disconnected');
//   // });
// });

var express = require('express');
var WebSocketServer = require('ws').Server;
var path = require('path');

var PORT = process.env.PORT || 8000;
var index = path.join(__dirname, 'index.html');

var server = express();

server.use(function(req, res) {
  res.sendFile(index);
});

server.listen(PORT, function() {
  console.log('Listening on ', PORT);
});
  
var wss = new WebSocketServer({ server: server });

wss.on('connection', function(connection) {
  console.log('Client connected');
  connection.on('close', function() {
    console.log('Client disconnected');
  });
});

setInterval(function() {
  wss.clients.forEach(function(client) {
    client.send(new Date().toTimeString());
  });
}, 1000);
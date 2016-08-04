// Create an Express app to handle routing
// http server to handle HTTP requests
// and socket.io instance (with http server passed in)
// to handle websocket requests
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.static(__dirname + '/public'));
// app.use('/peerjs', ExpressPeerServer(server, { debug: true }));

server.listen(process.env.PORT || 8000, function() {
  console.log('Now listening on ', server.address().port);
});

// WebRTC Handling Functions
var peers = [];
var mediaQueue = [];

var removePeer = function(deadPeer) {
  console.log('Removing ', deadPeer);
  peers = peers.filter(function(p) {
    return p !== deadPeer;
  });

  return peers;
};

var addPeer = function(newPeer) {
  if (peers.length < 4) {
    console.log('Adding', newPeer);
    peers.push(newPeer);
    console.log('Peer are', peers);
  } else {
    return 'Error';
  }
};

io.on('connection', function(socket) {
  console.log('User connected');
  var thisPeer = null;

  // Peer Connection Handling Events
  socket.on('peer-connect', function(peerId) {
    // send peers list to the newly-connected user
    socket.emit('peer-list', peers);
    thisPeer = peerId;

    // Sends message to everyone except itself
    socket.broadcast.emit('peer-connect', peerId);

    // Add the new user to the peer list
    addPeer(peerId);
  });

  socket.on('peer-disconnect', function(peerId) {
    removePeer(peerId);
    socket.broadcast.emit('peer-disconnect', peerId);
  });

  // Queue Handler Events
  socket.on('media-enque', function(item) {
    mediaQueue.push(item);
  });

  socket.on('media-dequeue', function(item) {
    var nextItem = mediaQueue.shift();
    io.emit('media-play', nextItem);
  });

  socket.on('media-jump-to-entry', function(item) {
    var index = 0;

    for (var i = 0; i < mediaQueue.length; i++) {
      if (mediaQueue[i].filename === item.filename) {
        index = i;
        i = mediaQueue.length; // exit the loop
      }
    }

    mediaQueue = mediaQueue.slice(index);
    io.emit('media-play', item);
  });

  socket.on('disconnect', function() {
    console.log('User disconnected', thisPeer);
    socket.broadcast.emit('peer-disconnect', thisPeer);
    removePeer(thisPeer);
  });

});

// // WebRTC related variables and functions
// var peers = [];  // Array of peer id's

// var sendPeersList = function() {
//   console.log('Currenly connected:', peers);
//   io.emit('peer-list', peers);
// };

// var removePeer = function(deadPeer) {
//   console.log('Removing ', deadPeer);
//   peers = peers.filter(function(p) {
//     return p !== deadPeer;
// });

//   return peers;
// };

// var addPeer = function(newPeer) {
//   console.log('Previously connected people: ', peers.length);
//   if (peers.length < 4) {
//     peers.push(newPeer);
//   } else {
//     return 'Error';
//   }
// };

// io.on('connection', function (socket) {
//   console.log('User connected');

//   socket.on('disconnect', function() {
//     console.log('User disconnected');
//   });

//   // Handling WebRTC related issues
//   socket.on('peer-connect', function(peerId) {
//     console.log('New peer connected:', peerId);
//     addPeer(peerId);
//     sendPeersList();
//   });

//   socket.on('peer-disconnect', function(peerId) {
//     console.log('Peer disconnected:', peerId);
//     removePeer(peerId);
//     sendPeersList();
//   });
// });





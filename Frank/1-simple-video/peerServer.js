var PeerServer = require('peer').PeerServer;
var server = PeerServer({port:9000, path: '/peerjs'});

server.on('connection', function(user) {
  console.log('New connection: ', user);
});
var express = require('express');
var cors = require('cors');
var path = require('path');

var server = express();
server.set('port', (process.env.PORT || 8000));

// Middleware
server.use(cors());
server.use(express.static(__dirname + '/'));

server.listen(server.get('port'), function() {
  console.log('Now listening on port ', server.get('port'));
});
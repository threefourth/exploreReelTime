$(document).ready(function() {

  // Set up the video and canvas elements
  // Don't use jQuery to grab the video elements - the resulting
  // jquery object will make it harder to access the src
  // and play variables/methods of the video element
  var video = document.getElementById("uservideoplayer");
  var peerVideo = document.getElementById("peervideoplayer");
  var localStream = null;

  // Set the Filter buttons
  $('#noFilterButton').on('click', function() {
    $('#uservideoplayer').removeClass();
  });

  $('#blurButton').on('click', function() {
    $('#uservideoplayer').removeClass();
    $('#uservideoplayer').addClass('blur');
  });

  $('#sepiaButton').on('click', function() {
    $('#uservideoplayer').removeClass();
    $('#uservideoplayer').addClass('sepia');
  });

  $('#grayScaleButton').on('click', function() {
    $('#uservideoplayer').removeClass();
    $('#uservideoplayer').addClass('grayscale');
  });

  // Set the constraints
  var defaultConstraints = {
    video: true,
    audio: false
  };

  var hdConstraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      }
    },
    audio: false
  };

  var vgaConstraints = {
    video: {
      mandatory: {
        maxWidth: 640,
        maxHeight: 360
      }
    },
    audio: false
  };

  // Establish the socket connection with the server
  // io() will default to the connection that's serving the page
  // So simple!
  var socket = io();
  
  // Chat Functions
  $('#chat-input').submit(function() {

    // The first parameter is the event name. Write function
    // on the server (socket.on('chat message')) to handle it
    socket.emit('chat message', $('#msg').val());
    $('#msg').val('');

    return false;
  });

  socket.on('chat message', function(msg) {
    console.log('Appending new message');
    $('#messages').append($('<li>').text(msg));
  });

  // WebRTC Functions
  // Create the Peer object to create and receive connections
  // Connecting to a locally hosted Peer Server
  // The first parameter is the 
  var pc1 = null;
  var pc2 = null;
  var conn;
  
  $('#startButton').on('click', function() {

    // Establish the two connections
    pc1 = new Peer('pc1', {
          host: 'localhost', 
          port: 9000, 
          path: '/peerjs',
          debug: 3,
          config: {'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca',
              credential: 'muazkh', username: 'webrtc@live.com' }
          ]}
        });

    pc2 = new Peer('pc2', {
          host: 'localhost', 
          port: 9000, 
          path: '/peerjs',
          debug: 3,
          config: {'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca',
              credential: 'muazkh', username: 'webrtc@live.com' }
          ]}
        });

    // Get user video and render it on the page
    navigator.mediaDevices.getUserMedia(defaultConstraints)
      .then(function(mediaStream) {

        localStream = mediaStream;
        video.src = URL.createObjectURL(mediaStream);

      },

      function(error) {
        console.log('Error:', error);
      });
  });

  $('#callButton').on('click', function() {
    conn = pc1.call('pc2', localStream);

    pc2.on('call', function(remoteCall) {
      remoteCall.answer();
      remoteCall.on('stream', function(remoteStream) {
        peerVideo.src = URL.createObjectURL(remoteStream);
      });
    });
  });

  $('#hangupButton').on('click', function() {
    console.log('Closing connections');
    pc1.disconnect();
    pc2.disconnect();
    conn.close();
  });

});






















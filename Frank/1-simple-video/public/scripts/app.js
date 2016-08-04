$(document).ready(function() {

  // Set up the video and canvas elements
  // Don't use jQuery to grab the video elements - the resulting
  // jquery object will make it harder to access the src
  // and play variables/methods of the video element
  var video = document.getElementById("uservideoplayer");
  var peerOneVideo = document.getElementById("peeronevideo");
  var peerTwoVideo = document.getElementById("peertwovideo");
  var peerThreeVideo = document.getElementById("peerthreevideo");

  // Set the constraints
  var defaultConstraints = {
    video: true,
    audio: true
  };

  // Establish the socket connection with the server
  // io() will default to the connection that's serving the page
  // So simple!
  var socket = io();

  var connectToSocket = function() {
    socket = io();
  };

  var disconnectFromSocket = function() {
    socket.disconnect();
  };  

  // WebRTC Functions
  // Create the Peer object to create and receive connections

  socket.on('peer-list', function(peerList) {
    console.log('Currently connected users:', peerList);
    initializePeerConnections(peerList);
  });

  socket.on('peer-connect', function(peerId) {
    console.log('New user connected:', peerId);
    handleNewPeer(peerId);
  });

  socket.on('peer-disconnect', function(peerId) {
    console.log('User disconnected:', peerId);
    handleDeadPeer(peerId);
  });

  var user = null; 
  var peers = {};  // Form: { call: peerCall, video: videoElement }

  var establishPeerCall = function(sourceId) {
    if (sourceId) {
      console.log('Calling', sourceId);
      var conn = user.call(sourceId, localStream, { reliable: true });
      return conn;
    
    } else {
      console.log('Getting WebRTC id');
      // user = new Peer({　host:'peerjs-server.herokuapp.com', secure:true, port:443, key: 'peerjs' });
      // user = new Peer({key: '39q8qnp4bfgsnhfr'});
      user = new Peer({ host:'peerjs-server-simple.herokuapp.com', secure:true, port:443, key:'peerjs' });

      user.on('open', function() {
        console.log('Communicating peerId to the web server');
        console.log('Connected as', user.id);
        socket.emit('peer-connect', user.id);
      });

      console.log('Preparing to receive/send calls');

      user.on('call', function(call) {
        console.log('Answering call from', call.peer);
        call.answer(localStream);

        call.on('stream', function(remoteStream) {
          console.log('Receiving and rendering stream from', call.peer);
          // peerOneVideo.src = URL.createObjectURL(remoteStream);
          var videoElement = findEmptyVideoElement();

          if (videoElement) {
            peers[call.peer].video = videoElement;
            videoElement.src = URL.createObjectURL(remoteStream);
            $(videoElement).removeClass('inactive').addClass('active');
            console.log(peers);
          }

        });
      });
    }
  };

  var findEmptyVideoElement = function() {
    // Use 'active' and 'inactive' classes to signify 
    // which video element to render the video to
    if ($(peerOneVideo).hasClass('inactive')) {
      return peerOneVideo;
    } 
    if ($(peerTwoVideo).hasClass('inactive')) {
      return peerTwoVideo;
    } 
    if ($(peerThreeVideo).hasClass('inactive')) {
      return peerThreeVideo;
    } 

    return null;
  };

  var initializePeerConnections = function(peerList) {
    peerList.forEach( function(peer) {
      handleNewPeer(peer);
    });
  };

  var handleNewPeer = function(peerId) {
    if (user) {
      if (peers[peerId]) {
        console.log('Already connected');
        return;
      }

      console.log('Connecting to new peer', peerId);
      peers[peerId] = {
        call: establishPeerCall(peerId)
      };
    }
  };

  var handleDeadPeer = function(peerId) {
    console.log('Disconnecting from', peerId);

    if (peers[peerId]) {
      // Clear the video element
      $(peers[peerId].video).removeClass('active').addClass('inactive');

      // Clear the peer object of the dead peer
      delete peers[peerId]; 
    }
  };

  // Button Controls
  $('#startButton').on('click', function() {
    
    if (user === null) {
      // Begin the local media stream
      navigator.mediaDevices.getUserMedia(defaultConstraints)
        .then(function(mediaStream) {
          video.src = URL.createObjectURL(mediaStream);
          localStream = mediaStream;
        });

      // Connect with the peer server
      establishPeerCall();      
    } else {
      console.log('You are already connected');
    }

  });

  $('#hangupButton').on('click', function() {
    console.log('Hanging up');
    socket.emit('peer-disconnect', user.id);
    user.destroy();
    user = null;

    // Clear all video elements
    $(peerOneVideo).removeClass('active').addClass('inactive');
    $(peerTwoVideo).removeClass('active').addClass('inactive');
    $(peerThreeVideo).removeClass('active').addClass('inactive');

    // Clear peer object
    peers = {};
  });

});

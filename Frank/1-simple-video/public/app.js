$(document).ready(function() {

  // Set up the video and canvas elements
  // Don't use jQuery to grab the video elements - the resulting
  // jquery object will make it harder to access the src
  // and play variables/methods of the video element
  var video = document.getElementById("uservideoplayer");
  var peerVideo = document.getElementById("peervideoplayer");

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

  // getUserMedia is called with an option telling it to
  // activate both the camera and the audio.
  // localMediaStream is the blob that represents data from
  // the media devices, which is then fed to the video element
  // var localStream = null;

  navigator.mediaDevices.getUserMedia(vgaConstraints)
    .then(function(mediaStream) {

      localStream = mediaStream;
      video.src = URL.createObjectURL(mediaStream);
      video.play();

      var audioContext = new AudioContext();
      var mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);

      mediaStreamSource.connect(audioContext.destination);
    },

    function(error) {
      console.log('Error:', error);
    });

  // Establish the RTC Connections
  // var config = 
  // var pc = RTCPeerConnection(config);

});







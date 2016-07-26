  // Set up the video and canvas elements
  var video = document.querySelector("#videoplayer");

  // getUserMedia is called with an option telling it to
  // activate both the camera and the audio.
  // localMediaStream is the blob that represents data from
  // the media devices, which is then fed to the video element
  navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(function(mediaStream) {
      console.log('Playing video');

      video.src = URL.createObjectURL(mediaStream);
      video.play();

      console.log('Playing audio');
      var audioContext = new AudioContext();
      var mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);

      mediaStreamSource.connect(audioContext.destination);
    },

    function(error) {
      console.log('Error:', error);
    });
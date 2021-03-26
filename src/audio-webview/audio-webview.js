import ABCJSLibrary from './abcjs_library.jstxt';

export default `
<html>
  <head>
    <script>
    ${ABCJSLibrary}
    </script>
    <script type="text/javascript">

    // will hold timeout for when playback ends
    var playbackTimeout = null;

    // global so it can be accessed from stop()
    midiBuffer = new ABCJS.synth.CreateSynth();

    function play(abcText, millisecondsPerMeasure, chordsOff, voicesOff) {
      const visualObj = ABCJS.renderAbc("*", abcText, { responsive: "resize" })[0];

      if (ABCJS.synth.supportsAudio()) {
        window.AudioContext = window.AudioContext ||
          window.webkitAudioContext ||
          navigator.mozAudioContext ||
          navigator.msAudioContext;
        var audioContext = new window.AudioContext();
        audioContext.resume().then(() => {
          return midiBuffer.init({
            visualObj,
            audioContext,
            millisecondsPerMeasure,
            options: {
              chordsOff,
              voicesOff
            }
          }).then(function (response) {
            return midiBuffer.prime();
          }).then(function () {
            midiBuffer.start();
            playbackTimeout = setTimeout(() => {
              window.ReactNativeWebView.postMessage('');
            }, midiBuffer.duration*1000);
          }).catch(function (error) {
            // err
          });
        });
      }
    }

    function stop() {
      if (midiBuffer) {
        midiBuffer.stop();
      }
      clearTimeout(playbackTimeout);
    };

</script>
</head>
  <body>
    <main>
    </main>
  </body>
</html>`;

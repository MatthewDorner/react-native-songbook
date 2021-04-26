import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Constants from '../../constants';
import Fonts from '../../styles/fonts';

import WebViewHtml from '../../audio-webview/audio-webview';

export default class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.webview = null;
  }

  componentDidMount() {
    const { confirmPlaybackStopped } = this.props;
    confirmPlaybackStopped();
  }

  componentDidUpdate() {
    // use abcText (from Redux audio slice) to inject into webview
    const { abcText, shouldPlay, shouldStop, playMode, playbackSpeed, confirmPlaybackStarted, confirmPlaybackStopped } = this.props;

    const chordsOff = playMode === Constants.PlayModes.MELODY_ONLY;
    const voicesOff = playMode === Constants.PlayModes.CHORDS_ONLY;
    const millisecondsPerMeasure = (100 - playbackSpeed) * 20; // to make the default 2000ms per measure

    if (shouldPlay) {
      this.webview.injectJavaScript('stop();');
      const escapedAbcText = JSON.stringify(abcText);
      this.webview.injectJavaScript(`play(\`${escapedAbcText}\`, ${millisecondsPerMeasure}, ${chordsOff}, ${voicesOff});`);
      confirmPlaybackStarted();
    } else if (shouldStop) {
      this.webview.injectJavaScript('stop();');
      confirmPlaybackStopped();
    }
  }

  render() {
    const { showControls, currentTuneAbcText, playing, startPlayback, stopPlayback } = this.props;

    return (
      <View style={styles.container}>
        <WebView
          style={styles.audioPlayer}
          ref={(webview) => { this.webview = webview; }}
          originWhitelist={['*']}
          source={{ html: WebViewHtml }}
          onMessage={() => {
            stopPlayback();
          }}
          mediaPlaybackRequiresUserAction={false}
        />
        { showControls && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            if (playing) {
              stopPlayback();
            } else {
              startPlayback({ abcText: currentTuneAbcText });
            }
          }}
        >
          <Text style={styles.playButtonTitle}>
            {playing ? '▪' : '▸'}
          </Text>
        </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'pink',
    flexDirection: 'column',
    marginBottom: 5
  },
  // this positioning probably doesn't work, it appears the same with no positioning at all
  audioPlayer: {
    flex: 0,
    display: 'none',
    height: 0,
    width: 0,
  },
  playButton: {
    // backgroundColor: 'yellow',
    paddingLeft: 8,
    paddingRight: 8,
    zIndex: 2,
    marginTop: 15,
    marginRight: 'auto',
  },
  playButtonTitle: {
    // backgroundColor: 'green',
    minWidth: 28,
    textAlign: 'center',
    fontFamily: Fonts.default,
    color: 'black',
    fontSize: 24 // should be same as title in global-style.js
  }
});

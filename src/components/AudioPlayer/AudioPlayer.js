import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { StyleSheet, View } from 'react-native';
import Constants from '../../constants';
import Colors from '../../styles/colors';

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
    // use tune (from Redux audio slice) to inject into webview
    const { tune, shouldPlay, shouldStop, playMode, playbackSpeed, confirmPlaybackStarted, confirmPlaybackStopped } = this.props;

    const chordsOff = playMode === Constants.PlayModes.MELODY_ONLY;
    const voicesOff = playMode === Constants.PlayModes.CHORDS_ONLY;
    const millisecondsPerMeasure = (100 - playbackSpeed) * 20; // to make the default 2000ms per measure

    if (shouldPlay) {
      this.webview.injectJavaScript(`play(\`${tune}\`, ${millisecondsPerMeasure}, ${chordsOff}, ${voicesOff});`);
      confirmPlaybackStarted();
    } else if (shouldStop) {
      this.webview.injectJavaScript('stop();');
      confirmPlaybackStopped();
    }
  }

  render() {
    // use currentTuneTune to call startPlayback()
    const { showControls, currentTuneTune, playing, startPlayback, stopPlayback } = this.props;

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
        <Button
          containerStyle={styles.playButtonContainer}
          buttonStyle={styles.playButtonButton}
          onPress={() => {
            if (playing) {
              stopPlayback();
            } else {
              startPlayback({ tune: currentTuneTune });
            }
          }}
          icon={(
            <Icon
              name={playing ? 'controller-stop' : 'controller-play'}
              size={18}
              color={Colors.playButtonIcon}
            />
          )}
        />
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  // this positioning probably doesn't work, it appears the same with no positioning at all
  audioPlayer: {
    flex: 0,
    display: 'none',
    height: 0,
    width: 0,
  },
  playButtonContainer: {
    marginTop: 11.5,
    marginRight: 'auto',
  },
  playButtonButton: {
    padding: 0,
    backgroundColor: Colors.playButtonBackground,
    height: 27,
    width: 27,
  }
});

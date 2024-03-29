import { connect } from 'react-redux';
import AudioPlayer from './AudioPlayer';
import { startPlayback, stopPlayback, confirmPlaybackStarted, confirmPlaybackStopped, updateAudioOptions } from '../../redux/audio-slice';

function mapStateToProps(state) {
  const { playing, abcText, shouldPlay, shouldStop, playMode, playbackSpeed } = state.audio;
  return { playing, abcText, playMode, playbackSpeed, shouldPlay, shouldStop };
}

export default connect(mapStateToProps, { updateAudioOptions, startPlayback, stopPlayback, confirmPlaybackStarted, confirmPlaybackStopped })(AudioPlayer);

import { Navigation } from 'react-native-navigation';

const TopBrowser = require('./components/TopBrowser');
const CollectionBrowser = require('./components/CollectionBrowser');
const CurrentTune = require('./components/CurrentTune');

export default function registerScreens() {
  Navigation.registerComponent('TopBrowser', () => TopBrowser.default);
  Navigation.registerComponent('CollectionBrowser', () => CollectionBrowser.default);
  Navigation.registerComponent('CurrentTune', () => CurrentTune.default);
}

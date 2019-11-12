import { Navigation } from 'react-native-navigation';

const TopBrowser = require('./components/TopBrowser');
const CollectionBrowser = require('./components/CollectionBrowser');
const CurrentTune = require('./components/CurrentTune');
const Info = require('./components/Info');

export default function registerScreens() {
  Navigation.registerComponent('TopBrowser', () => TopBrowser.default);
  Navigation.registerComponent('CollectionBrowser', () => CollectionBrowser.default);
  Navigation.registerComponent('CurrentTune', () => CurrentTune.default);
  Navigation.registerComponent('Info', () => Info.default);
}

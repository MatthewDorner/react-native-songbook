import { Navigation } from 'react-native-navigation';

const TopBrowser = require('./components/TopBrowser');
const CollectionBrowser = require('./components/CollectionBrowser');
const CurrentTune = require('./components/CurrentTune');
const SearchContainer = require('./components/SearchContainer');

export default function registerScreens() {
  Navigation.registerComponent('TopBrowser', () => TopBrowser.default);
  Navigation.registerComponent('CollectionBrowser', () => CollectionBrowser.default);
  Navigation.registerComponent('CurrentTune', () => CurrentTune.default);
  Navigation.registerComponent('SearchContainer', () => SearchContainer.default);
}

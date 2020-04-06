import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from './redux/store';

const TopBrowser = require('./components/TopBrowser');
const CollectionBrowser = require('./components/CollectionBrowser');
const CurrentTune = require('./components/CurrentTune');
const Info = require('./components/Info');

export default function registerScreens() {
  Navigation.registerComponentWithRedux('TopBrowser', () => TopBrowser.default, Provider, store);
  Navigation.registerComponentWithRedux('CollectionBrowser', () => CollectionBrowser.default, Provider, store);
  Navigation.registerComponentWithRedux('CurrentTune', () => CurrentTune.default, Provider, store);
  Navigation.registerComponent('Info', () => Info.default);
}

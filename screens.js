// screens.js

import { Navigation } from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('CurrentTune', () => require('./components/CurrentTune').default);
  Navigation.registerComponent('TunesList', () => require('./components/TunesList').default);
}

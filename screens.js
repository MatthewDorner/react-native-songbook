// screens.js

import { Navigation } from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('TopBrowser', () => require('./components/TopBrowser').default);
  Navigation.registerComponent('CollectionBrowser', () => require('./components/CollectionBrowser').default);  
  Navigation.registerComponent('CurrentTune', () => require('./components/CurrentTune').default);
  Navigation.registerComponent('SearchContainer', () => require('./components/SearchContainer').default);
}

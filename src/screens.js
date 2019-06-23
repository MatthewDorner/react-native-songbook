import { Navigation } from 'react-native-navigation';

const AddCollectionModal = require('./components/AddCollectionModal');
const AddSetlistModal = require('./components/AddSetlistModal');
const TopBrowser = require('./components/TopBrowser');
const CollectionBrowser = require('./components/CollectionBrowser');
const CurrentTune = require('./components/CurrentTune');
const SearchContainer = require('./components/SearchContainer');
const AddToSetlistModal = require('./components/AddToSetlistModal');

export default function registerScreens() {
  Navigation.registerComponent('TopBrowser', () => TopBrowser.default);
  Navigation.registerComponent('CollectionBrowser', () => CollectionBrowser.default);
  Navigation.registerComponent('CurrentTune', () => CurrentTune.default);
  Navigation.registerComponent('SearchContainer', () => SearchContainer.default);
  Navigation.registerComponent('AddCollectionModal', () => AddCollectionModal.default);
  Navigation.registerComponent('AbstractModal', () => AbstractModal.default);
  Navigation.registerComponent('AddSetlistModal', () => AddSetlistModal.default);
  Navigation.registerComponent('AddToSetlistModal', () => AddToSetlistModal.default);
}

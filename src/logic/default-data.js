import Constants from './constants';
import Jigs from './jigs';

export default {
  defaultCollections: [
    {
      Name: 'Nottingham Dataset',
      Type: Constants.CollectionTypes.COLLECTION
    }, {
      Name: 'Favorites',
      Type: Constants.CollectionTypes.SETLIST
    }
  ],
  defaultTunes: Jigs
};

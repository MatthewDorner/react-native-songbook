import Constants from './constants';
import Jigs from './jigs';
import TiesAndSlurs from './ties-and-slurs';

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

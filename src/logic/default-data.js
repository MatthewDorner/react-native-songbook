import Constants from './constants';

import Ashover from '../../node_modules/nottingham-dataset/ABC_cleaned/ashover.abc';

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
  defaultTunes: Ashover
};

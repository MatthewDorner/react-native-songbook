import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Picker
} from 'react-native';

import Constants from '../constants';
import ListStyles from '../styles/list-styles';
import TuneRepository from '../data-access/tune-repository';

export default function CollectionListItem(props) {
  const { queriedBy, fetchCurrentTune, item, showModal, startPlayback } = props;

  let pickerOptions = [];
  if (queriedBy === Constants.CollectionTypes.COLLECTION || queriedBy === Constants.CollectionTypes.ALL) {
    pickerOptions = [
      <Picker.Item label="Cancel" value="cancel" key="cancel" />,
      <Picker.Item label="Details" value="details" key="details" />,
      <Picker.Item label="Play" value="play" key="play" />,
      <Picker.Item label="Add to Setlist" value="addToSetlist" key="addToSetlist" />,
      <Picker.Item label="Move to Collection" value="moveToCollection" key="moveToCollection" />,
      <Picker.Item label="Delete" value="delete" key="delete" />
    ];
  } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
    pickerOptions = [
      <Picker.Item label="Cancel" value="cancel" key="cancel" />,
      <Picker.Item label="Details" value="details" key="details" />,
      <Picker.Item label="Play" value="play" key="play" />,
      <Picker.Item label="Remove from Setlist" value="removeFromSetlist" key="removeFromSetlist" />
    ];
  }

  return (
    <>
      <View style={ListStyles.listItem}>
        <TouchableOpacity
          onPress={() => {
            fetchCurrentTune(item.rowid);
          }}
        >
          <Text style={ListStyles.listItemTitle}>
            {item.Title}
          </Text>
        </TouchableOpacity>
        <Picker
          style={ListStyles.listItemPicker}
          onValueChange={async (action) => {
            if (action === 'play') {
              const tune = await TuneRepository.get(item.rowid);
              startPlayback({ abcText: tune.AbcText });
            } else {
              showModal(action, item);
            }
          }}
        >
          {pickerOptions}
        </Picker>
      </View>
      <Text style={ListStyles.listItemDetail}>
        {`Key: ${item.Key}`}
        {(item.Rhythm ? `, Rhythm: ${item.Rhythm}` : '')}
      </Text>
      <View style={ListStyles.listItemSeparator} />
    </>
  );
}

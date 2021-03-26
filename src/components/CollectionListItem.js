import React, { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Picker
} from 'react-native';

import Constants from '../constants';
import ListStyles from '../styles/list-styles';
import TuneRepository from '../data-access/tune-repository';

export default function CollectionListItem(props) {
  const { queriedBy, fetchTune, item, showModal, startPlayback } = props;
  const [tune, setTune] = useState({});

  // Loading each full tune because I couldn't find a way to load it only upon "play from browser" action.
  // The async call to DB wouldn't complete until the user performed some other action, even something
  // as minor as scrolling the list. Don't know why this is.

  useEffect(() => {
    const loadData = async () => {
      try {
        const wholeTune = await TuneRepository.get(item.rowid);
        setTune(wholeTune.Tune);
      } catch (e) {
        Alert.alert('CollectionListItem error', `${e}`);
      }
    };
    loadData();
  }, []);

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
            fetchTune(item.rowid);
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
              startPlayback({ tune });
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

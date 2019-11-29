import React, { PureComponent } from 'react';
import {
  Picker,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Constants from '../data-access/constants';
import ListStyles from '../styles/list-styles';

export default class CollectionBrowser extends PureComponent {

  render() {
    const { queriedBy, tuneChangeCallback, item, showModal } = this.props;

    let pickerOptions = [];
    if (queriedBy === Constants.CollectionTypes.COLLECTION) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Add to Setlist" value="addToSetlist" key="addToSetlist" />,
        <Picker.Item label="Move to Collection" value="moveToCollection" key="moveToCollection" />,
        <Picker.Item label="Delete" value="delete" key="delete" />
      ];
    } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Remove from Setlist" value="removeFromSetlist" key="removeFromSetlist" />
      ];
    }

    return (
      <View style={ListStyles.listItem}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                if (tuneChangeCallback.callback) {
                  tuneChangeCallback.callback(item.rowid);
                }
              }}
            >
              <Text style={ListStyles.listItemTitle}>
                {item.Title}
              </Text>
            </TouchableOpacity>
            <Picker
              style={ListStyles.listItemPicker}
              onValueChange={(action) => {
                showModal(action, item);
              }}
            >
              {pickerOptions}
            </Picker>
          </View>
          <View>
            <Text style={ListStyles.listItemDetail}>
              {`Key: ${item.Key}`}
              {(item.Rhythm ? `, Rhythm: ${item.Rhythm}` : '')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

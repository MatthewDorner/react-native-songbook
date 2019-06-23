import React, { Component } from 'react';
import AbstractModal from './AbstractModal';
import ModalStyles from '../styles/modal-styles';
import Database from '../data-access/database';
import Constants from '../logic/constants';

import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Picker
} from 'react-native';

export default class AddToSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setlists: [],
      selectedSetlist: {}
    };

    this.addToSetlistOperation = this.addToSetlistOperation.bind(this);

    // get the setlists from database & set to state
    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      //console.log('in AddToSetlistModal, setting this.state.setlists to: ');
      //console.log(setlists);
      //console.log('also, this.props.tune was: ');
      //console.log(this.props.tune);

      this.setState({
        setlists,
        selectedSetlist: setlists[0].rowid
      });
    });

    // the song's rowid needs to be provided to this component

  }

  async addToSetlistOperation() {
    try {
      let rowid = this.props.tune.rowid;
      let prevSetlists = this.props.tune.Setlists;
      let newSetlists;

      if (!prevSetlists.includes(',' + this.state.selectedSetlist + ',')) {
        if (prevSetlists == '') {
          newSetlists = ',' + this.state.selectedSetlist + ',';
        } else {
          newSetlists = prevSetlists + this.state.selectedSetlist + ',';
        }
      } else {
        newSetlists = prevSetlists;
      } // or make an error "already in setlist"

      let tuneDelta = {
        Setlists: newSetlists
      };

      //console.log('AddToSetlistModal::addToSetlistOperation, going to call Database.updateTune with: ');
      //console.log('rowid: ', rowid);
      //console.log('tuneDelta: ');
      //console.log(tuneDelta);

      Database.updateTune(rowid, tuneDelta).then((res) => {
        this.props.closeModal();
      }).catch((e) => {
        //console.log('failed to add to setlist, error was: ');
        //console.log(e);
      });
    } catch (e) {
      alert("exception in createSetlistOperation" + e);
    }
  }


  render() {


    //console.log('in render, this.state.setlists was: ');
    //console.log(this.state.setlists);
    const setlistPickerOptions = this.state.setlists.map((setlist) => {
      return <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />
    });

    return (
      <AbstractModal submit={this.addToSetlistOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Add To Setlist</Text>

        <Picker
          // selectedValue={''}
          style={{height: 50, width: '80%'}}
          selectedValue={this.state.selectedSetlist}
          onValueChange={(itemValue) => {
            this.setState({
              selectedSetlist: itemValue
            });
        }}>
          {setlistPickerOptions}
        </Picker>


        <Text style={ModalStyles.message}>
          Select a setlist to add this song to.
        </Text>

      </AbstractModal>
    );
  }
}

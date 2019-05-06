import React, { Component } from 'react';
import Database from '../database';

import {
  FlatList,
  Button
} from 'react-native';
import { Navigation } from 'react-native-navigation';

export default class TunesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tunes: []
    };

    let tunes = [];
    Database.db.transaction((txn) => {
      txn.executeSql('select * from Tunes', [], (tx, res) => {
        for (let i = 0; i < res.rows.length; ++i) {
          tunes.push(res.rows.item(i));
          // console.log('in TunesList, querying, got:', res.rows.item(i));
        }
        
        tunes.forEach((tune) => {
          tune.Tune = tune.Tune.replace(/\"\"/g, "\"");
        })

      });
    }, (error) => {
      // error
    }, () => {

      // console.log('in trans success: ');
      // console.log(tunes);

      this.setState({tunes: tunes});
    });   



    // this.state = {
    //   tunes: tunes.map((tune) => {
    //     return {
    //       title: tune.Title,
    //       key: tune.rowid
    //     };
    //   })
    // };

    // console.log('tunes was: ');
    // console.log(tunes);
    // console.log('state.tunes was: ');
    // console.log(this.state.tunes);
  }

  _renderItem = ({ item }) => (
    <Button
      onPress={() => {
        Navigation.push('testId', {
          component: {
            name: 'CurrentTune',
            passProps: {
              tune: item
            }
          }
        });
      }}
      title={item.Title}
    />
  );

  render() {
    return (
      <FlatList
        contentContainerStyle={{ alignItems: 'center' }}
        data={this.state.tunes}
        renderItem={this._renderItem}
      />
    );
  }
}

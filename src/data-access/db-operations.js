// When possible, use the readTransaction() to obtain better execution performance of SQL statements.
// Your query %searchword% cause table scan, it will get slower as number of records increase. Use searchword% query to get index base fast query.

import SQLite from 'react-native-sqlite-2';
import DefaultData from './default-data';
import Database from './database';

/*
  this module contains higher-level database "operations" that contain some program logic,
  as opposed to database.js which should be limited to basic CRUD operations and the sqlite
  db itself
*/

// option? remove .db to a separate, third file? would be less hierarchical so probablybad.
// better to find a way to get this init code separated between database.js and index.js

export default {
  init() {
    return new Promise((resolve, reject) => {
      Database.db = SQLite.openDatabase('tunebook.db', '1.0', '', 1);
      Database.db.transaction((txn) => {
        txn.executeSql('DROP TABLE IF EXISTS Tunes', []); // JUST FOR TESTING
        txn.executeSql('DROP TABLE IF EXISTS Collections', []); // JUST FOR TESTING
        // what's the deal with txn and tx here? what tx is provided from .executeSql()?
        txn.executeSql('select * from sqlite_master where type = "table" and name = "Tunes"', [], (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('CREATE TABLE `Tunes` (`Tune` TEXT, `Title` TEXT, `Rhythm` TEXT, `Key` TEXT, `Collection` INTEGER, `Setlists` TEXT)', [], (tx, res) => {
              // res
            });
            txn.executeSql('CREATE TABLE `Collections` (`Name` TEXT, `Type` INTEGER)', [], (tx, res) => {
              // res
            });
            this.importTuneBook(DefaultData.defaultTunes);
            this.importDefaultCollections(DefaultData.defaultCollections);
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve();
      });
    });
  },

  importTuneBook(tuneBook, collection) {
    return new Promise((resolve, reject) => {
      // "The tune header should start with an X:(reference number) field followed
      // by a T:(title) field and finish with a K:(key) field."
      const escapedTuneBook = tuneBook.replace(/"/g, '""');
      const tunes = escapedTuneBook.split('\nX:'); // TODO: trim whitespace somewhere around here....
      tunes.forEach((tune, i) => { // very sloppy
        if (!tunes[i].startsWith('X:')) {
          tunes[i] = `X:${tune}`;
        }
      });

      let songsAdded = 0;

      Database.db.transaction((txn) => {
        tunes.forEach((tune) => {
          let rhythm = '';
          tune.split('\n').forEach((line) => {
            if (line.startsWith('R:')) { // will it work if there's a line that's just 'R:' ??
              rhythm = line.slice(2, line.length);
            }
          });
          let title = '';
          tune.split('\n').forEach((line) => {
            if (line.startsWith('T:')) {
              title = line.slice(2, line.length);
            }
          });
          let key = '';
          tune.split('\n').forEach((line) => {
            if (line.startsWith('K:')) {
              key = line.slice(2, line.length);
            }
          });

          let collectionDest;
          const setlists = '[]';

          // change this cheap way of detecting whether we're doing init or user import
          if (!collection) {
            collectionDest = 1; // should be the rowId for nottingham default data
          } else { // it's a new collection added by user
            collectionDest = collection;
          }
          txn.executeSql(`insert into Tunes (Tune, Title, Rhythm, Key, Collection, Setlists) VALUES ("${tune}", "${title}", "${rhythm}", "${key}", "${collectionDest}", "${setlists}")`, [], (tx, res) => {
            songsAdded += 1;
          });
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(songsAdded);
      });
    });
  },

  addTuneToSetlist(tune, setlistId) {
    return new Promise((resolve, reject) => {
      const { rowid } = tune;
      const prevSetlists = JSON.parse(tune.Setlists);
      let newSetlists = [];

      if (prevSetlists.includes(setlistId)) {
        newSetlists = prevSetlists;
      } else {
        newSetlists = prevSetlists.concat(setlistId);
      }

      const delta = { Setlists: JSON.stringify(newSetlists) };
      Database.updateTune(rowid, delta).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  removeTuneFromSetlist(tune, setlistId) {
    return new Promise((resolve, reject) => {
      const { rowid } = tune;
      const prevSetlists = JSON.parse(tune.Setlists);
      let newSetlists = [];

      newSetlists = prevSetlists.filter(setlist => setlist !== setlistId);

      const delta = { Setlists: JSON.stringify(newSetlists) };
      Database.updateTune(rowid, delta).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  importDefaultCollections(collections) {
    return new Promise((resolve, reject) => {
      Database.db.transaction((txn) => {
        collections.forEach((collection) => {
          txn.executeSql(`insert into Collections (Name, Type) VALUES ("${collection.Name}", "${collection.Type}")`, [], (tx, res) => {
            // res
          });
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve();
      });
    });
  }
};

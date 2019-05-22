// When possible, use the readTransaction() to obtain better execution performance of SQL statements.
// Your query %searchword% cause table scan, it will get slower as number of records increase. Use searchword% query to get index base fast query.

import SQLite from 'react-native-sqlite-2';
import TestData from './test-data';
import Constants from './constants';

export default {
  db: null,

  init() {
    this.db = SQLite.openDatabase('tunebook.db', '1.0', '', 1);
    this.db.transaction((txn) => {
      txn.executeSql('DROP TABLE IF EXISTS Tunes', []); // JUST FOR TESTING  
      txn.executeSql('DROP TABLE IF EXISTS Collections', []); // JUST FOR TESTING  
      txn.executeSql('select * from sqlite_master where type = "table" and name = "Tunes"', [], (tx, res) => {
        if (res.rows.length == 0) {
          txn.executeSql('CREATE TABLE `Tunes` (`Tune` TEXT, `Title` TEXT, `Rhythm` TEXT, `Key` TEXT, `Collection` INTEGER, `Setlists` TEXT)', [], (tx, res) => {
            // res
          });
          txn.executeSql('CREATE TABLE `Collections` (`Name` TEXT, `Type` INTEGER)', [], (tx, res) => {
            // res
          });
          this.importTuneBook(TestData.testTunes); // should be promise? .then() or at least not inside transaction?
          // IMPORT FAKE COLLECTIONS AND SETLISTS, INIT CAN BE REWORKED AT THE END WHEN I TAKE TEST DATA AWAY
          this.importTestCollections(TestData.testCollections);
        }
      });
    })
  },

  getTunesForCollection(collection, queriedBy) {
    return new Promise((resolve, reject) => {
      let tunes = [];
      this.db.transaction((txn) => {
        if (queriedBy == Constants.CollectionTypes.COLLECTION) {
          var query = 'select * from Tunes where Collection = ' + collection;
        } else if (queriedBy == Constants.CollectionTypes.SETLIST) {
          var query = 'select * from Tunes where Setlists like "%,' + collection + ',%"';
        }
        txn.executeSql(query, [], (tx, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            let tune = res.rows.item(i);
            tune.Tune = tune.Tune.replace(/\"\"/g, "\"");
            tunes.push(tune);
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(tunes);
      });   
    });
  },

  getCollections(type) {
    return new Promise((resolve, reject) => {
      let collections = [];
      this.db.transaction((txn) => {
        txn.executeSql('select rowid, Name, Type from Collections where Type = ' + type, [], (tx, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            let collection = res.rows.item(i);
            collections.push(collection);
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(collections);
      });   
    });
  },

  importTuneBook(tuneBook) {
    // "The tune header should start with an X:(reference number) field followed by a T:(title) field and finish with a K:(key) field."
    tuneBook = tuneBook.replace(/\"/g, "\"\"");
    let tunes = tuneBook.split('\nX:'); // TODO: trim whitespace somewhere around here....
    tunes.forEach((tune, i) => { // very sloppy
      if (!tunes[i].startsWith("X:")) {
        tunes[i] = "X:" + tune;
      }
    })

    this.db.transaction((txn) => {
      tunes.forEach((tune, i) => {
        let rhythm = "";
        tune.split('\n').forEach((line) => {
          if (line.startsWith('R:')) {  // will it work if there's a line that's just 'R:' ??
            rhythm = line.slice(2, line.length);
          }
        });
        let title = "";
        tune.split('\n').forEach((line) => {
          if (line.startsWith('T:')) {
            title = line.slice(2, line.length);
          }
        });
        let key = ""
        tune.split('\n').forEach((line) => {
          if (line.startsWith('K:')) {
            key = line.slice(2, line.length);
          }
        });

        let collection = (i % 3) + 1;
        let setlists = "," + ((i % 3) + 4) + ",5,";
        txn.executeSql('insert into Tunes (Tune, Title, Rhythm, Key, Collection, Setlists) VALUES ("' + tune + '", "' + title + '", "' + rhythm + '", "' + key + '", "' + collection + '", "' + setlists + '")', [], function (tx, res) {
          // res
        });
      });
    }, (error) => {
      // transaction error
    }, () => {
      // transaction success
      this.db.transaction((txn) => {
          txn.executeSql('select * from Tunes', [], (tx, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              console.log('added tune, got: ' + res.rows.item(i));
            }          
          });
        });      
    }); // end transaction
  },

  importTestCollections(collections) {
    this.db.transaction((txn) => {
      collections.forEach((collection) => {
        txn.executeSql('insert into Collections (Name, Type) VALUES ("' + collection.Name + '", "' + collection.Type + '")', [], function (tx, res) {
          // res
        });
      });
    }, (error) => {
      // transaction error
    }, () => {
      // transaction success
      this.db.transaction((txn) => {
          txn.executeSql('select * from Collections', [], (tx, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              console.log('added collection, got: ' + res.rows.item(i));
            }          
          });
        });      
    }); // end transaction
  }
};

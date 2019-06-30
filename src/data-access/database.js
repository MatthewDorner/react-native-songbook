// When possible, use the readTransaction() to obtain better execution performance of SQL statements.
// Your query %searchword% cause table scan, it will get slower as number of records increase. Use searchword% query to get index base fast query.

import SQLite from 'react-native-sqlite-2';
import DefaultData from '../logic/default-data';
import Constants from '../logic/constants';

export default {
  db: null,

  init() {
    return new Promise((resolve, reject) => {
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

  getTunesForCollection(collection, queriedBy) {
    return new Promise((resolve, reject) => {
      const tunes = [];
      let query = '';
      this.db.transaction((txn) => {
        if (queriedBy === Constants.CollectionTypes.COLLECTION) {
          query = `select rowid, Collection, Key, Rhythm, Setlists, Title, Tune from Tunes where Collection = ${collection}`;
        } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
          query = `select rowid, Collection, Key, Rhythm, Setlists, Title, Tune from Tunes where Setlists like "%,${collection},%"`;
        }
        txn.executeSql(query, [], (tx, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            const tune = res.rows.item(i);
            tune.Tune = tune.Tune.replace(/\"\"/g, '"');
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
      const collections = [];
      this.db.transaction((txn) => {
        txn.executeSql(`select rowid, Name, Type from Collections where Type = ${type}`, [], (tx, res) => {
          for (let i = 0; i < res.rows.length; ++i) {
            const collection = res.rows.item(i);
            collections.push(collection);
            //console.log(collection);
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(collections);
      });
    });
  },

  importTuneBook(tuneBook, collection) {
    return new Promise((resolve, reject) => {
      // "The tune header should start with an X:(reference number) field followed
      // by a T:(title) field and finish with a K:(key) field."
      const escapedTuneBook = tuneBook.replace(/\"/g, '""');
      const tunes = escapedTuneBook.split('\nX:'); // TODO: trim whitespace somewhere around here....
      tunes.forEach((tune, i) => { // very sloppy
        if (!tunes[i].startsWith('X:')) {
          tunes[i] = `X:${tune}`;
        }
      });

      let songsAdded = 0;

      this.db.transaction((txn) => {
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
          // these lines starting with 'Y:' cause abcjs to error, but should be replaced by 'P:'
          cleanedTune = tune.split('\n').filter((line) => {
            if (line.startsWith('Y:')) {
              return false;
            }
            return true;
          }).join('\n');

          let collectionDest, setlists;
          if (!collection) {
            collectionDest = 1; // should be the rowId for nottingham default data
            setlists = '';
          } else { // it's a new collection added by user
            collectionDest = collection;
            setlists = '';
          }
          txn.executeSql(`insert into Tunes (Tune, Title, Rhythm, Key, Collection, Setlists) VALUES ("${cleanedTune}", "${title}", "${rhythm}", "${key}", "${collectionDest}", "${setlists}")`, [], (tx, res) => {
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

  addCollection(name, type) {
    return new Promise((resolve, reject) => {
      let sqlResult;
      this.db.transaction((txn) => {
        txn.executeSql(`insert into Collections (Name, Type) VALUES ("${name}", "${type}")`, [], (tx, res) => {
          sqlResult = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(sqlResult);
      });
    });
  },

  deleteTune(tune) {
    return new Promise((resolve, reject) => {
      let sqlResult;
      this.db.transaction((txn) => {
        txn.executeSql(`delete from Tunes where rowid = "${tune.rowid}"`, [], (tx, res) => {
          sqlResult = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(sqlResult);
      });
    });
  },

  deleteCollection(rowid) {
    return new Promise((resolve, reject) => {
      let sqlResult;
      this.db.transaction((txn) => {
        txn.executeSql(`delete from Collections where rowid = "${rowid}"`, [], (tx, res) => {
          sqlResult = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(sqlResult);
      });
    });
  },

  removeTuneFromSetlist(tune, setlistId) {
    return new Promise((resolve, reject) => {
      let rowid = tune.rowid;
      let prevSetlists = tune.Setlists;
      let newSetlists;

      let setlistSubstr = ',' + setlistId + ',';

      if (prevSetlists.indexOf(setlistSubstr) != -1) {
        if (prevSetlists == setlistSubstr) { // it's the only one
          newSetlists = ''; 
        } else {
          newSetlists = prevSetlists.replace(setlistSubstr + ',', '');
        }
      } else {
        // error, tune does not belong to setlist (how did you get here?)
      }

      let sql = 'update Tunes set Setlists = "' + newSetlists + '" where rowid = ' + rowid;

      this.db.transaction((txn) => {
        txn.executeSql(sql, [], (tx, res) => {
          result = res;
        });
      }, (error) => {
        reject(error)
      }, () => {
        resolve(result);
      });
    });
  },

  // still use this to add to setlist, not sure how want this to work w/ removeTuneFromSetlist
  // maybe removeTuneFromSetlist can be a wrapper around this, or maybe all database operation
  // methods should be moved to single place, such as db-operations.js, that use methods of
  // database.js. would just need to pass some of the props into the db-operations.js methods
  updateTune(rowid, delta) {
    return new Promise((resolve, reject) => {

      let update = 'update Tunes set ';
      let fields = '';
      for (field in delta) {  
        fields += field + ' = "' + delta[field] + '",';
      }
      fields = fields.substring(0, fields.length - 1);
      let where = ' where rowid = ' + rowid;
      let sql = update + fields + where;

      let result;
      this.db.transaction((txn) => {
        txn.executeSql(sql, [], (tx, res) => {
          result = res;
        });
      }, (error) => {
        reject(error)
      }, () => {
        resolve(result);
      });
    });
  },

  importDefaultCollections(collections) {
    return new Promise((resolve, reject) => {
      this.db.transaction((txn) => {
        collections.forEach((collection) => {
          txn.executeSql(`insert into Collections (Name, Type) VALUES ("${collection.Name}", "${collection.Type}")`, [], (tx, res) => {
            // res
          });
        });
      }, (error) => {
        reject(error)
      }, () => {
        resolve();
        this.db.transaction((txn) => {
          //console.log('added default collections, collections table now has: ');
          txn.executeSql('select * from Collections', [], (tx, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              //console.log(res.rows.item(i));
            }
          });
        });
      });
    });
  }
};

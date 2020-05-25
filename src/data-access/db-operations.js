// default data is not needed unless the database is running for the first time, but we can't
// conditionally import. unless they're imported by file system instead of JS includes. so
// maybe should change that.
import DefaultData from './default-data';
import Database from './database';
import Constants from '../constants';

/*
  this module contains higher-level database "operations" that contain some program logic,
  as opposed to database.js which should be limited to basic CRUD operations and the sqlite
  db itself
*/

export default {
  init() {
    Database.initDb();
    return new Promise((resolve, reject) => {
      // COMMENT THIS CODE FOR RELEASE
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, 'DROP TABLE IF EXISTS Tunes', []); // JUST FOR TESTING
        Database.executeSqlDebug(txn, 'DROP TABLE IF EXISTS Collections', []); // JUST FOR TESTING
        Database.executeSqlDebug(txn, 'DROP TABLE IF EXISTS Options', []); // JUST FOR TESTING
      }, (error) => {
        reject(error);
      }, () => {
        resolve();
      });

      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, 'select * from sqlite_master where type = "table" and name = "Tunes"', [], (tx, res) => {
          if (res.rows.length === 0) {
            Database.executeSqlDebug(txn, 'CREATE TABLE `Tunes` (`Tune` text, `Title` text, `Rhythm` text, `Key` text, `Collection` integer, `Setlists` text)', [], (tx, res) => {
              // res
            });
            Database.executeSqlDebug(txn, 'CREATE TABLE `Collections` (`Name` text, `Type` integer)', [], (tx, res) => {
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

      // to support upgrading from 1.0 to 1.1 software version, check for / add this table separately, though
      // next release should add a database schema version stored in the DB for upgrades.
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, 'select * from sqlite_master where type = "table" and name = "Options"', [], (tx, res) => {
          if (res.rows.length === 0) {
            Database.executeSqlDebug(txn, 'CREATE TABLE `Options` (`Zoom` integer, `TabsVisibility` integer, `Tuning` text, `PlayMode` integer, `PlaybackSpeed` integer)', [], (tx, res) => {
              console.log('tried to create, res was:');
              console.log(res);
              // res
            });
            const defaultTuning = Object.keys(Constants.Tunings)[0];
            Database.executeSqlDebug(txn, `insert into Options (Zoom, TabsVisibility, Tuning, PlayMode, PlaybackSpeed) values (50, 1, "${defaultTuning}", 0, 50)`, [], (tx, res) => {
              // res
            });
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve();
      });
    });
  },

  importTuneBook(tuneBook, collection = 1) {
    return new Promise((resolve, reject) => {
      // "The tune header should start with an X:(reference number) field followed
      // by a T:(title) field and finish with a K:(key) field."
      const escapedTuneBook = tuneBook.replace(/"/g, '""');

      const tunes = escapedTuneBook.split('\nX:'); // TODO: trim whitespace somewhere around here....
      const correctedTunes = tunes.filter((tune) => {
        if (tune) {
          return true;
        }
        return false;
      }).map((tune) => {
        if (!tune.startsWith('X:')) {
          return `X:${tune}`;
        }
        return tune;
      });

      let songsAdded = 0;

      Database.db.transaction((txn) => {
        correctedTunes.forEach((tune) => {
          const rhythm = getAbcField(tune, 'R').replace(/ /g, '');
          let title = getAbcField(tune, 'T');
          // remove period from end of title
          if (title.endsWith('.')) {
            title = title.slice(0, title.length - 1);
          }
          // remove spaces at beginning of title
          while (title.startsWith(' ')) {
            title = title.slice(1, title.length);
          }
          if (title === '') {
            return; // many books have "blank" tunes at beginning with info about book
          }
          const key = getAbcField(tune, 'K').replace(/ /g, '');
          const setlists = '[]';

          Database.executeSqlDebug(txn, `insert into Tunes (Tune, Title, Rhythm, Key, Collection, Setlists) values ("${tune}", "${title}", "${rhythm}", "${key}", "${collection}", "${setlists}")`, [], (tx, res) => {
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

  importDefaultCollections(collections) {
    return new Promise((resolve, reject) => {
      Database.db.transaction((txn) => {
        collections.forEach((collection) => {
          Database.executeSqlDebug(txn, `insert into Collections (Name, Type) values ("${collection.Name}", "${collection.Type}")`, [], (tx, res) => {
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

/**
 * Used for getting information fields from ABC notation strings without having to use
 * abcjs parser
 * @param   {string} abcString the ABC notation string
 * @param   {string} field the ABC information field such as "X", "T", "R"
 *
 * @returns {string} the first line in the abcString starting with the field
 */
function getAbcField(abcString, field) {
  const lines = abcString.split('\n');
  const fieldLines = lines.filter(line => line.charAt(0) === field);
  if (fieldLines[0]) {
    return fieldLines[0].slice(2, fieldLines[0].length);
  }
  return '';
}

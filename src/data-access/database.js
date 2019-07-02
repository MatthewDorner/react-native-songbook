import Constants from '../logic/constants';

export default {
  db: null, // gets set by init() in db-operations, for now

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
          }
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(collections);
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

  updateTune(rowid, delta) {
    return new Promise((resolve, reject) => {
      // although this is set up to use a delta, actually it will only work for string
      // fields with how it's written so far. would need a way to differentiate between
      // field that require the value to be in quotes vs those that don't. but there may
      // never be another need to use this function..

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
};

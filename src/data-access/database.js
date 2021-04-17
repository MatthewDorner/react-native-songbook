import SQLite from 'react-native-sqlite-2';

export default {
  db: null,

  initDb() {
    this.db = SQLite.openDatabase('tunebook.db', '1.0', '', 1);
  },

  executeSqlDebug(txn, query, parameters, callback) {
    // console.log('SQL QUERY: \n' + query);
    txn.executeSql(query, parameters, (tx, res) => {
      // console.log(res);
      if (callback) {
        callback(tx, res);
      }
    });
  },
};

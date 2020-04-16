import Repository from './repository';
import Field from './field';
import Constants from '../constants';
import TableSchema from './table-schema';
import Database from './database';

class TuneRepository extends Repository {
  constructor() {
    const tableSchema = new TableSchema(
      'Tunes', [
        new Field('Tune', Constants.FieldTypes.TEXT),
        new Field('Title', Constants.FieldTypes.TEXT),
        new Field('Key', Constants.FieldTypes.TEXT),
        new Field('Collection', Constants.FieldTypes.INTEGER),
        new Field('Setlists', Constants.FieldTypes.TEXT),
      ],
    );
    super(tableSchema);
  }

  async get(rowid) {
    const tune = await super.get(rowid);
    tune.Tune = tune.Tune.replace(/""/g, '"');
    return tune;
  }

  // to hopefully improve list speed, this will not retrieve all fields. It will only get the fields necessary
  // for collectionBrowser to create the list. when the full text is required, must call get() for the
  // individual tune

  // should collection here use a dto instead of simply a rowid???
  getPartialTunesForCollection(collection, queriedBy) {
    return new Promise((resolve, reject) => {
      let tunes = [];
      let query = '';
      Database.db.transaction((txn) => {
        if (queriedBy === Constants.CollectionTypes.COLLECTION) {
          query = `select rowid, Key, Rhythm, Title from ${this.tableSchema.tableName} where Collection = ${collection} order by Title COLLATE NOCASE ASC`;
        } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
          query = `select rowid, Key, Rhythm, Title from ${this.tableSchema.tableName} where (Setlists like "%[${collection}]%" or Setlists like "%[${collection}," or Setlists like "%,${collection}]") order by Title COLLATE NOCASE ASC`;
        }

        // are there any other characters that need to be escaped??
        Database.executeSqlDebug(txn, query, [], (tx, res) => {
          // or don't use _array, though then need to loop through rows? but that must be how you're supposed to do it.
          tunes = res.rows._array;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(tunes);
      });
    });
  }

  // only for Collection not Setlist
  deleteTunesForCollection(collection) {
    return new Promise((resolve, reject) => {
      let result = null;
      Database.db.transaction((txn) => {
        const query = `delete from ${this.tableSchema.tableName} where Collection = ${collection}`;

        Database.executeSqlDebug(txn, query, [], (tx, res) => {
          result = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(result);
      });
    });
  }
}

export default new TuneRepository();

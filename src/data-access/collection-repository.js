import Repository from './repository';
import Field from './field';
import Constants from '../constants';
import TableSchema from './table-schema';
import Database from './database';

class CollectionRepository extends Repository {
  constructor() {
    const tableSchema = new TableSchema(
      'Collections', [
        new Field('Name', Constants.FieldTypes.TEXT),
        new Field('Type', Constants.FieldTypes.INTEGER),
      ],
    );
    super(tableSchema);
  }

  getCollectionsByType(type) {
    return new Promise((resolve, reject) => {
      const collections = [];
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, `select rowid, Name, Type from ${this.tableSchema.tableName} where Type = ${type}`, [], (tx, res) => {
          for (let i = 0; i < res.rows.length; i += 1) {
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
  }
}

export default new CollectionRepository();

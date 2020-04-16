import Database from './database';

export default class Repository {
  constructor(tableSchema) {
    this.tableSchema = tableSchema;
  }

  insert(dto) {
    return new Promise((resolve, reject) => {
      let sqlResult;
      const fields = this.tableSchema.getFieldsForDto(dto);
      const values = this.tableSchema.getValuesForDto(dto);
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, `insert into ${this.tableSchema.tableName} (${fields}) values (${values})`, [], (tx, res) => {
          sqlResult = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(sqlResult);
      });
    });
  }

  update(dto) {
    return new Promise((resolve, reject) => {
      const update = `update ${this.tableSchema.tableName} set `;
      const fields = this.tableSchema.getUpdateFieldsForDto(dto);
      const where = ` where rowid = ${dto.rowid}`;
      const sql = update + fields + where;

      let result;
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, sql, [], (tx, res) => {
          result = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(result);
      });
    });
  }

  delete(dto) {
    return new Promise((resolve, reject) => {
      let sqlResult;
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, `delete from ${this.tableSchema.tableName} where rowid = "${dto.rowid}"`, [], (tx, res) => {
          sqlResult = res;
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(sqlResult);
      });
    });
  }

  get(rowid) {
    return new Promise((resolve, reject) => {
      const fields = this.tableSchema.getAllFields();
      const query = `select ${fields} from ${this.tableSchema.tableName} where rowid = ${rowid}`;
      let dto = null;
      Database.db.transaction((txn) => {
        Database.executeSqlDebug(txn, query, [], (tx, res) => {
          if (!res.rows.item(0)) {
            reject(new Error(`Database: ${this.tableSchema.tableName} record with rowid ${rowid} not found`));
            return;
          }
          dto = res.rows.item(0);
        });
      }, (error) => {
        reject(error);
      }, () => {
        resolve(dto);
      });
    });
  }
}

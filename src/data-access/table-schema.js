import Constants from '../constants';

/*
  contains the schema for a table (table name, fields) and methods to create strings of
  fields / values to be used in constructing queries. could move all the query construction
  logic into this module??

  ought to throw an error if a dto is passed with invalid fields...
*/

export default class TableSchema {
  constructor(tableName, fields) {
    this.fields = fields;
    this.tableName = tableName;
  }

  getCreateTableSQL() {
    let fields = '';
    this.fields.forEach((field) => {
      if (fields !== '') {
        fields += ',';
      }
      fields += `\`${field.name}\` ${field.type},`;
    });

    return `CREATE TABLE \`${this.tableName}\` (${fields})`;
  }


  // to be used when retrieving all columns of a single record, so
  // it should include rowid
  getAllFields() {
    let fields = 'rowid';
    this.fields.forEach((field) => {
      fields += `,${field.name}`;
    });
    return fields;
  }

  // these could be reduce() functions
  // arr.reduce(callback( accumulator, currentValue[, index[, array]] )[, initialValue])

  // used by Insert, but Insert should require the dto to have all fields. TypeScript can
  // help with that.
  getFieldsForDto(dto) {
    let fields = '';
    this.fields.forEach((field) => {
      if (dto[field.name] !== undefined) {
        if (fields !== '') {
          fields += ',';
        }
        fields += `${field.name}`;
      }
    });
    return fields;
  }

  // used by Insert
  getValuesForDto(dto) {
    let values = '';
    this.fields.forEach((field) => {
      if (dto[field.name] !== undefined) {
        if (values !== '') {
          values += ',';
        }
        if (field.type === Constants.FieldTypes.TEXT) {
          values += `"${dto[field.name]}"`;
        } else if (field.type === Constants.FieldTypes.INTEGER) {
          values += `${dto[field.name]}`;
        }
      }
    });
    return values;
  }

  getUpdateFieldsForDto(dto) {
    let update = '';
    this.fields.forEach((field) => {
      if (dto[field.name] !== undefined) {
        if (update !== '') {
          update += ',';
        }
        if (field.type === Constants.FieldTypes.TEXT) {
          update += `${field.name} = "${dto[field.name]}"`;
        } else if (field.type === Constants.FieldTypes.INTEGER) {
          update += `${field.name} = ${dto[field.name]}`;
        }
      }
    });
    return update;
  }
}

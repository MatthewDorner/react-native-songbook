import Repository from './repository';
import Field from './field';
import Constants from '../constants';
import TableSchema from './table-schema';

class OptionsRepository extends Repository {
  constructor() {
    const tableSchema = new TableSchema(
      'Options', [
        new Field('Zoom', Constants.FieldTypes.INTEGER),
        new Field('TabsVisibility', Constants.FieldTypes.INTEGER),
        new Field('Tuning', Constants.FieldTypes.TEXT),
        new Field('PlayMode', Constants.FieldTypes.INTEGER),
        new Field('PlaybackSpeed', Constants.FieldTypes.INTEGER),
      ],
    );
    super(tableSchema);
  }

  get() {
    return super.get(1);
  }

  update(dto) {
    return super.update({ ...dto, rowid: 1 });
  }
}

export default new OptionsRepository();

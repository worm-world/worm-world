import {
  deleteStrain,
  getCountFilteredStrains,
  getFilteredStrains,
  insertDbStrain,
  insertStrainsFromFile,
} from 'api/strain';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import DataPage from 'components/DataPage/DataPage';
import { ColumnDefinitionType } from 'components/Table/Table';
import { db_Strain } from 'models/db/db_Strain';
import { StrainFieldName } from 'models/db/filter/db_StrainFieldName';

export const cols: Array<ColumnDefinitionType<db_Strain>> = [
  { key: 'name', header: 'Name' },
  { key: 'notes', header: 'Notes' },
];

const fields: Array<Field<db_Strain>> = [
  {
    name: 'name',
    title: 'Variation Name',
    type: 'text',
  },
  {
    name: 'notes',
    title: 'Notes',
    type: 'text',
  },
];

const nameMapping: { [key in keyof db_Strain]: StrainFieldName } = {
  name: 'Name',
  notes: 'Notes',
};

export default function StrainDataPage(): JSX.Element {
  return (
    <DataPage
      title='Strains'
      dataName='strain'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredStrains}
      getCountFilteredData={getCountFilteredStrains}
      insertDatum={insertDbStrain}
      insertDataFromFile={insertStrainsFromFile}
      deleteRecord={deleteStrain}
    />
  );
}

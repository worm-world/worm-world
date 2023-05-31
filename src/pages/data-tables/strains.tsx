import {
  deleteStrain,
  getCountFilteredStrains,
  getFilteredStrains,
  insertDbStrain,
  insertStrainsFromFile,
} from 'api/strain';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataPage from 'components/DataPage/DataPage';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type db_Strain } from 'models/db/db_Strain';
import { type StrainFieldName } from 'models/db/filter/db_StrainFieldName';

export const cols: Array<ColumnDefinitionType<db_Strain>> = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
];

const fields: Array<Field<db_Strain>> = [
  {
    name: 'name',
    title: 'Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
];

const nameMapping: { [key in keyof db_Strain]: StrainFieldName } = {
  name: 'Name',
  description: 'Description',
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

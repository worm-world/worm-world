import {
  deleteStrain,
  getCountFilteredStrains,
  getFilteredStrains,
  insertDbStrain,
  insertStrainsFromFile,
  updateStrain,
} from 'api/strain';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataTableView from 'components/DataTableView/DataTableView';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type db_Strain } from 'models/db/db_Strain';
import { type StrainFieldName } from 'models/db/filter/db_StrainFieldName';

export const cols: Array<ColumnDefinitionType<db_Strain>> = [
  { key: 'name', header: 'Name' },
  { key: 'genotype', header: 'Genotype' },
  { key: 'description', header: 'Description' },
];

const fields: Array<Field<db_Strain>> = [
  {
    name: 'name',
    title: 'Name',
    type: 'text',
  },
  {
    name: 'genotype',
    title: 'Genotype',
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
  genotype: 'Genotype',
  description: 'Description',
};

export default function StrainDataTable(): React.JSX.Element {
  return (
    <DataTableView
      title='Strains'
      dataName='strain'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredStrains}
      getCountFilteredRecords={getCountFilteredStrains}
      insertRecord={insertDbStrain}
      insertRecordsFromFile={insertStrainsFromFile}
      deleteRecord={deleteStrain}
      updateRecord={async (row, column, value) => {
        const newRow = structuredClone(row);
        newRow[column.key] = value;
        await updateStrain(row.name, newRow);
      }}
    />
  );
}

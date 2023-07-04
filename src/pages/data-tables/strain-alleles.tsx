import {
  getFilteredStrainAlleles,
  getCountFilteredStrainAlleles,
  insertDbStrainAllele,
  insertStrainAllelesFromFile,
  deleteStrainAllele,
} from 'api/strainAllele';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataTable from 'components/DataTable/DataTable';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type db_StrainAllele } from 'models/db/db_StrainAllele';
import { type StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';

export const cols: Array<ColumnDefinitionType<db_StrainAllele>> = [
  { key: 'strain_name', header: 'Strain Name' },
  { key: 'allele_name', header: 'Allele Name' },
  { key: 'is_on_top', header: 'Is On Top' },
  { key: 'is_on_bot', header: 'Is On Bottom' },
];

const fields: Array<Field<db_StrainAllele>> = [
  {
    name: 'strain_name',
    title: 'Strain Name',
    type: 'text',
  },
  {
    name: 'allele_name',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'is_on_top',
    title: 'Is On Top',
    type: 'boolean',
  },
  {
    name: 'is_on_bot',
    title: 'Is On Bottom',
    type: 'boolean',
  },
];

const nameMapping: { [key in keyof db_StrainAllele]: StrainAlleleFieldName } = {
  strain_name: 'StrainName',
  allele_name: 'AlleleName',
  is_on_top: 'IsOnTop',
  is_on_bot: 'IsOnBot',
};

export default function StrainDataTable(): JSX.Element {
  return (
    <DataTable
      title='Strain Alleles'
      dataName='strainAlleles'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredStrainAlleles}
      getCountFilteredRecords={getCountFilteredStrainAlleles}
      insertRecord={insertDbStrainAllele}
      insertRecordsFromFile={insertStrainAllelesFromFile}
      deleteRecord={deleteStrainAllele}
    />
  );
}

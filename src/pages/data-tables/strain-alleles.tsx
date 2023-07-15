import {
  getFilteredStrainAlleles,
  getCountFilteredStrainAlleles,
  insertDbStrainAllele,
  insertStrainAllelesFromFile,
  deleteStrainAllele,
} from 'api/strainAllele';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataTableView from 'components/DataTableView/DataTableView';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type db_StrainAllele } from 'models/db/db_StrainAllele';
import { type StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';

export const cols: Array<ColumnDefinitionType<db_StrainAllele>> = [
  { key: 'strainName', header: 'Strain Name' },
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'isOnTop', header: 'Is On Top' },
  { key: 'isOnBot', header: 'Is On Bottom' },
];

const fields: Array<Field<db_StrainAllele>> = [
  {
    name: 'strainName',
    title: 'Strain Name',
    type: 'text',
  },
  {
    name: 'alleleName',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'isOnTop',
    title: 'Is On Top',
    type: 'boolean',
  },
  {
    name: 'isOnBot',
    title: 'Is On Bottom',
    type: 'boolean',
  },
];

const nameMapping: { [key in keyof db_StrainAllele]: StrainAlleleFieldName } = {
  strainName: 'StrainName',
  alleleName: 'AlleleName',
  isOnTop: 'IsOnTop',
  isOnBot: 'IsOnBot',
};

export default function StrainDataTable(): React.JSX.Element {
  return (
    <DataTableView
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

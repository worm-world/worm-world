import {
  deleteAllele,
  getCountFilteredAlleles,
  getFilteredAlleles,
  insertAllelesFromFile,
  insertDbAllele,
} from 'api/allele';
import { type db_Allele } from 'models/db/db_Allele';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import DataPage from 'components/DataPage/DataPage';
import { type Field } from 'components/ColumnFilter/ColumnFilter';

export const cols: Array<ColumnDefinitionType<db_Allele>> = [
  { key: 'name', header: 'Name' },
  { key: 'sysGeneName', header: 'Systematic Gene Name' },
  { key: 'variationName', header: 'Variation Name' },
  { key: 'contents', header: 'Contents' },
];
const fields: Array<Field<db_Allele>> = [
  {
    name: 'name',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'contents',
    title: 'Allele Contents',
    type: 'text',
  },
  {
    name: 'sysGeneName',
    title: 'Systematic Gene Name',
    type: 'text',
  },
  {
    name: 'variationName',
    title: 'Variation Name',
    type: 'text',
  },
];

const nameMapping: { [key in keyof db_Allele]: AlleleFieldName } = {
  name: 'Name',
  sysGeneName: 'SysGeneName',
  variationName: 'VariationName',
  contents: 'Contents',
};

export default function AlleleDataPage(): JSX.Element {
  return (
    <DataPage
      title='Alleles'
      dataName='alleles'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredAlleles}
      getCountFilteredData={getCountFilteredAlleles}
      insertDatum={insertDbAllele}
      insertDataFromFile={insertAllelesFromFile}
      deleteRecord={deleteAllele}
    />
  );
}

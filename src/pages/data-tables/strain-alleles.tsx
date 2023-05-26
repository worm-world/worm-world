import {
  getFilteredStrainAlleles,
  getCountFilteredStrainAlleles,
  insertDbStrainAllele,
  insertStrainAllelesFromFile,
  deleteStrainAllele,
} from 'api/strainAlleles';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import DataPage from 'components/DataPage/DataPage';
import { ColumnDefinitionType } from 'components/Table/Table';
import { db_StrainAllele } from 'models/db/db_StrainAllele';
import { StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';

export const cols: Array<ColumnDefinitionType<db_StrainAllele>> = [
  { key: 'strain', header: 'Strain' },
  { key: 'allele', header: 'Allele' },
];

const fields: Array<Field<db_StrainAllele>> = [
  {
    name: 'strain',
    title: 'Strain',
    type: 'text',
  },
  {
    name: 'allele',
    title: 'Allele',
    type: 'text',
  },
];

const nameMapping: { [key in keyof db_StrainAllele]: StrainAlleleFieldName } = {
  strain: 'Strain',
  allele: 'Allele',
};

export default function StrainDataPage(): JSX.Element {
  return (
    <DataPage
      title='Strain Alleles'
      dataName='strainAlleles'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredStrainAlleles}
      getCountFilteredData={getCountFilteredStrainAlleles}
      insertDatum={insertDbStrainAllele}
      insertDataFromFile={insertStrainAllelesFromFile}
      deleteRecord={deleteStrainAllele}
    />
  );
}

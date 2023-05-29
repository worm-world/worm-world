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
  { key: 'strain_name', header: 'Strain Name' },
  { key: 'allele_name', header: 'Allele Name' },
  { key: 'homozygous', header: 'Homozygous' },
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
    name: 'homozygous',
    title: 'Homozygous',
    type: 'boolean',
  },
];

const nameMapping: { [key in keyof db_StrainAllele]: StrainAlleleFieldName } = {
  strain_name: 'StrainName',
  allele_name: 'AlleleName',
  homozygous: 'Homozygous',
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

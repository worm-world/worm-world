import {
  getFilteredStrainAlleles,
  getCountFilteredStrainAlleles,
  insertDbStrainAllele,
  insertStrainAllelesFromFile,
  deleteStrainAllele,
} from 'api/strainAllele';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataPage from 'components/DataPage/DataPage';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type db_StrainAllele } from 'models/db/db_StrainAllele';
import { type StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';

export const cols: Array<ColumnDefinitionType<db_StrainAllele>> = [
  { key: 'strain_name', header: 'Strain Name' },
  { key: 'allele_name', header: 'Allele Name' },
  { key: 'is_homozygous', header: 'Is Homozygous' },
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
    name: 'is_homozygous',
    title: 'Is Homozygous',
    type: 'boolean',
  },
];

const nameMapping: { [key in keyof db_StrainAllele]: StrainAlleleFieldName } = {
  strain_name: 'StrainName',
  allele_name: 'AlleleName',
  is_homozygous: 'IsHomozygous',
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

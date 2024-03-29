import { type db_Phenotype } from 'models/db/db_Phenotype';
import { type ColumnDefinitionType } from 'components/Table/Table';
import {
  deletePhenotype,
  getCountFilteredPhenotypes,
  getFilteredPhenotypes,
  insertDbPhenotype,
  insertPhenotypesFromFile,
} from 'api/phenotype';
import { type PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import DataTableView from 'components/DataTableView/DataTableView';
import { type Field } from 'components/ColumnFilter/ColumnFilter';

export const cols: Array<ColumnDefinitionType<db_Phenotype>> = [
  { key: 'name', header: 'Name' },
  { key: 'wild', header: 'Wild' },
  { key: 'description', header: 'Description' },
  { key: 'maleMating', header: 'Male Mating' },
  { key: 'lethal', header: 'Lethal' },
  { key: 'femaleSterile', header: 'Female Sterile' },
  { key: 'arrested', header: 'Arrested' },
  { key: 'maturationDays', header: 'Maturation Days' },
  { key: 'shortName', header: 'Short Name' },
];

const fields: Array<Field<db_Phenotype>> = [
  {
    name: 'name',
    title: 'Phenotype Name',
    type: 'text',
  },
  {
    name: 'shortName',
    title: 'Short Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    name: 'maleMating',
    title: 'Male Mating',
    type: 'number',
  },
  {
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
  {
    name: 'wild',
    title: 'Is Wild',
    type: 'boolean',
  },
  {
    name: 'lethal',
    title: 'Lethal',
    type: 'boolean',
  },
  {
    name: 'femaleSterile',
    title: 'Female Sterile',
    type: 'boolean',
  },
  {
    name: 'arrested',
    title: 'Arrested',
    type: 'boolean',
  },
];

const nameMapping: { [key in keyof db_Phenotype]: PhenotypeFieldName } = {
  name: 'Name',
  shortName: 'ShortName',
  description: 'Description',
  maleMating: 'MaleMating',
  maturationDays: 'MaturationDays',
  wild: 'Wild',
  lethal: 'Lethal',
  femaleSterile: 'FemaleSterile',
  arrested: 'Arrested',
};

export default function PhenotypeDataTable(): React.JSX.Element {
  return (
    <DataTableView
      title='Phenotypes'
      dataName='phenotype'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredPhenotypes}
      getCountFilteredRecords={getCountFilteredPhenotypes}
      insertRecord={insertDbPhenotype}
      insertRecordsFromFile={insertPhenotypesFromFile}
      deleteRecord={deletePhenotype}
    />
  );
}

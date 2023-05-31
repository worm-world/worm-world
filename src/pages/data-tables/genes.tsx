import {
  deleteGene,
  getCountFilteredGenes,
  getFilteredGenes,
  insertDbGene,
  insertGenesFromFile,
} from 'api/gene';
import { type db_Gene } from 'models/db/db_Gene';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { chromosomes } from 'models/frontend/Chromosome';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import { type GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import DataPage from 'components/DataPage/DataPage';

export const cols: Array<ColumnDefinitionType<db_Gene>> = [
  { key: 'sysName', header: 'Systematic Name' },
  { key: 'descName', header: 'Descriptive Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const fields: Array<Field<db_Gene>> = [
  {
    name: 'sysName',
    title: 'Systematic Name',
    type: 'text',
  },
  {
    name: 'descName',
    title: 'Descriptive Name',
    type: 'text',
  },
  {
    name: 'chromosome',
    title: 'Chromosome Number',
    type: 'select',
    selectOptions: chromosomes,
  },
  {
    name: 'physLoc',
    title: 'Physical Location',
    type: 'number',
  },
  {
    name: 'geneticLoc',
    title: 'Genetic Location',
    type: 'number',
  },
];

const nameMapping: { [key in keyof db_Gene]: GeneFieldName } = {
  sysName: 'SysName',
  descName: 'DescName',
  chromosome: 'Chromosome',
  physLoc: 'PhysLoc',
  geneticLoc: 'GeneticLoc',
  recombSuppressor: 'RecombSuppressor',
};

export default function GeneDataPage(): JSX.Element {
  return (
    <DataPage
      title='Genes'
      dataName='gene'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredGenes}
      getCountFilteredData={getCountFilteredGenes}
      insertDatum={insertDbGene}
      insertDataFromFile={insertGenesFromFile}
      deleteRecord={deleteGene}
    />
  );
}

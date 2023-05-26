import {
  deleteVariation,
  getCountFilteredVariations,
  getFilteredVariations,
  insertDbVariation,
  insertVariationsFromFile,
} from 'api/variation';
import { db_Variation } from 'models/db/db_Variation';
import { ColumnDefinitionType } from 'components/Table/Table';
import { chromosomes } from 'models/frontend/Chromosome';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import DataPage from 'components/DataPage/DataPage';
import { Field } from 'components/ColumnFilter/ColumnFilter';

export const cols: Array<ColumnDefinitionType<db_Variation>> = [
  { key: 'alleleName', header: 'Variation Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const fields: Array<Field<db_Variation>> = [
  {
    name: 'alleleName',
    title: 'Variation Name',
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

const nameMapping: { [key in keyof db_Variation]: VariationFieldName } = {
  alleleName: 'AlleleName',
  chromosome: 'Chromosome',
  physLoc: 'PhysLoc',
  geneticLoc: 'GenLoc',
  recombSuppressor: 'RecombSuppressor',
};

export default function VariationDataPage(): JSX.Element {
  return (
    <DataPage
      title='Variations'
      dataName='variation'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredVariations}
      getCountFilteredData={getCountFilteredVariations}
      insertDatum={insertDbVariation}
      insertDataFromFile={insertVariationsFromFile}
      deleteRecord={deleteVariation}
    />
  );
}

import {
  deleteVariation,
  getCountFilteredVariations,
  getFilteredVariations,
  insertDbVariation,
  insertVariationsFromFile,
} from 'api/variation';
import { type db_Variation } from 'models/db/db_Variation';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { chromosomes } from 'models/frontend/Chromosome';
import { type VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import DataTableView from 'components/DataTableView/DataTableView';
import { type Field } from 'components/ColumnFilter/ColumnFilter';

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

export default function VariationDataTable(): React.JSX.Element {
  return (
    <DataTableView
      title='Variations'
      dataName='variation'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredVariations}
      getCountFilteredRecords={getCountFilteredVariations}
      insertRecord={insertDbVariation}
      insertRecordsFromFile={insertVariationsFromFile}
      deleteRecord={deleteVariation}
    />
  );
}

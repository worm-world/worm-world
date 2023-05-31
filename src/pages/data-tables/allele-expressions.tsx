import {
  deleteAlleleExpression,
  getCountFilteredAlleleExpressions,
  getFilteredAlleleExpressions,
  insertAlleleExpressionsFromFile,
  insertDbAlleleExpression,
} from 'api/alleleExpression';
import { type db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import DataPage from 'components/DataPage/DataPage';
import { type Field } from 'components/ColumnFilter/ColumnFilter';

export const cols: Array<ColumnDefinitionType<db_AlleleExpression>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
  { key: 'dominance', header: 'Dominance' },
];

const fields: Array<Field<db_AlleleExpression>> = [
  {
    name: 'alleleName',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'expressingPhenotypeName',
    title: 'Expressing Phenotype Name',
    type: 'text',
  },
  {
    name: 'expressingPhenotypeWild',
    title: 'Expressing Phenotype Wild',
    type: 'boolean',
  },
  {
    name: 'dominance',
    title: 'Dominance',
    type: 'number',
    selectOptions: ['Recessive', 'SemiDominant', 'Dominant'],
  },
];

const nameMapping: {
  [key in keyof db_AlleleExpression]: AlleleExpressionFieldName;
} = {
  alleleName: 'AlleleName',
  expressingPhenotypeName: 'ExpressingPhenotypeName',
  expressingPhenotypeWild: 'ExpressingPhenotypeWild',
  dominance: 'Dominance',
};

export default function AlleleExpressionDataPage(): JSX.Element {
  return (
    <DataPage
      title='Allele Expressions'
      dataName='alleleExpression'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredAlleleExpressions}
      getCountFilteredData={getCountFilteredAlleleExpressions}
      insertDatum={insertDbAlleleExpression}
      insertDataFromFile={insertAlleleExpressionsFromFile}
      deleteRecord={deleteAlleleExpression}
    />
  );
}

import {
  getCountFilteredExpressionRelations,
  getFilteredExpressionRelations,
  insertDbExpressionRelation,
  insertExpressionRelationsFromFile,
} from 'api/expressionRelation';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ColumnDefinitionType } from 'components/Table/Table';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import DataPage from 'components/DataPage/DataPage';

export const cols: Array<ColumnDefinitionType<db_ExpressionRelation>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
  { key: 'alteringPhenotypeName', header: 'Altering Phenotype Name' },
  { key: 'alteringPhenotypeWild', header: 'Altering Phenotype Wild' },
  { key: 'alteringCondition', header: 'Altering Condition' },
  { key: 'isSuppressing', header: 'Is Suppressing' },
];

const fields: Array<Field<db_ExpressionRelation>> = [
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
    name: 'alteringPhenotypeName',
    title: 'altering Phenotype Name',
    type: 'text',
  },
  {
    name: 'alteringPhenotypeWild',
    title: 'Altering Phenotype Wild',
    type: 'boolean',
  },
  {
    name: 'alteringCondition',
    title: 'Altering Condition',
    type: 'text',
  },
  {
    name: 'isSuppressing',
    title: 'Is Suppressing',
    type: 'boolean',
  },
];

const nameMapping: {
  [key in keyof db_ExpressionRelation]: ExpressionRelationFieldName;
} = {
  alleleName: 'AlleleName',
  expressingPhenotypeName: 'ExpressingPhenotypeName',
  expressingPhenotypeWild: 'ExpressingPhenotypeWild',
  alteringPhenotypeName: 'AlteringPhenotypeName',
  alteringPhenotypeWild: 'AlteringPhenotypeWild',
  alteringCondition: 'AlteringCondition',
  isSuppressing: 'IsSuppressing',
};

export default function ExpressionRelationDataPage(): JSX.Element {
  return (
    <DataPage
      title='Expression Relation'
      dataName='expressionRelation'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredExpressionRelations}
      getCountFilteredData={getCountFilteredExpressionRelations}
      insertDatum={insertDbExpressionRelation}
      insertDataFromFile={insertExpressionRelationsFromFile}
    />
  );
}

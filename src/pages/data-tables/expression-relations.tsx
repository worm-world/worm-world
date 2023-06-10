import {
  deleteExpressionRelation,
  getCountFilteredExpressionRelations,
  getFilteredExpressionRelations,
  insertDbExpressionRelation,
  insertExpressionRelationsFromFile,
} from 'api/expressionRelation';
import { type db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { type ColumnDefinitionType } from 'components/Table/Table';
import { type ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataTablePage from 'components/DataTablePage/DataTablePage';

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

export default function ExpressionRelationDataTablePage(): JSX.Element {
  return (
    <DataTablePage
      title='Expression Relations'
      dataName='expressionRelation'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredExpressionRelations}
      getCountFilteredRecords={getCountFilteredExpressionRelations}
      insertRecord={insertDbExpressionRelation}
      insertRecordsFromFile={insertExpressionRelationsFromFile}
      deleteRecord={deleteExpressionRelation}
    />
  );
}

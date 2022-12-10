import { useEffect, useState } from 'react';
import {
  getFilteredExpressionRelations,
  insertDbExpressionRelation,
} from 'api/expressionRelation';
import { toast } from 'react-toastify';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';
import { db_Error } from 'models/db/db_Error';
import ToastInfo from 'components/ToastInfo/ToastInfo';

export const cols: Array<ColumnDefinitionType<db_ExpressionRelation>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
  { key: 'alteringPhenotypeName', header: 'Altering Phenotype Name' },
  { key: 'alteringPhenotypeWild', header: 'Altering Phenotype Wild' },
  { key: 'alteringCondition', header: 'Altering Condition' },
  { key: 'isSuppressing', header: 'Is Suppressing' },
];

const fields = [
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

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_ExpressionRelation[]>([]);
  const onRecordInsertionFormSubmission = (
    record: db_ExpressionRelation
  ): void => {
    insertDbExpressionRelation(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast.error('An error has occured when inserting data: ' + JSON.stringify(e));
      });
  };

  const refresh = (): void => {
    getFilteredExpressionRelations({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch(e =>
        toast.error('Unable to get expression relations: ' + JSON.stringify(e), {
          toastId: 'expression-relations',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 items-center px-6 place-items-center'>
        <h1 className='data-table-title col-start-2'>Expression Relations</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Expression Relation'
          fields={fields as Array<FieldType<db_ExpressionRelation>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

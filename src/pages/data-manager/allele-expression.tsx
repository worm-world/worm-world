import { useEffect, useState } from 'react';
import {
  getFilteredAlleleExpressions,
  insertDbAlleleExpression,
} from 'api/alleleExpressions';
import { toast } from 'react-toastify';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';

export const cols: Array<ColumnDefinitionType<db_AlleleExpression>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
  { key: 'dominance', header: 'Dominance' },
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
    name: 'dominance',
    title: 'Dominance',
    type: 'number',
    selectOptions: ['Recessive', 'SemiDominant', 'Dominant'],
  },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_AlleleExpression[]>([]);
  const onRecordInsertionFormSubmission = (
    record: db_AlleleExpression
  ): void => {
    insertDbAlleleExpression(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast.error(
          'An error has occured when inserting data: ' + JSON.stringify(e)
        );
      });
  };
  const refresh = (): void => {
    getFilteredAlleleExpressions({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error('Unable to get allele expressions: ' + JSON.stringify(e), {
          toastId: 'allele-expressions',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 items-center px-6 place-items-center'>
        <h1 className='data-table-title col-start-2'>Allele Expressions</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Allele Expression'
          fields={fields as Array<FieldType<db_AlleleExpression>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

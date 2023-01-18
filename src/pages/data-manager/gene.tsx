import { useEffect, useState } from 'react';
import { getFilteredGenes, insertDbGene } from 'api/gene';
import { toast } from 'react-toastify';
import { db_Gene } from 'models/db/db_Gene';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';
import { chromosomes } from 'models/frontend/Chromosome';

export const cols: Array<ColumnDefinitionType<db_Gene>> = [
  { key: 'sysName', header: 'Systematic Name' },
  { key: 'descName', header: 'Descriptive Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const fields = [
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

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Gene[]>([]);
  const onRecordInsertionFormSubmission = (
    record: db_Gene,
    successCallback: () => void
  ): void => {
    insertDbGene(record)
      .then((resp) => {
        successCallback();
        refresh();
      })
      .catch((e: Error) => {
        toast.error(
          'An error has occured when inserting data: ' + JSON.stringify(e)
        );
      });
  };

  const refresh = (): void => {
    getFilteredGenes({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error('Unable to get genes: ' + JSON.stringify(e), {
          toastId: 'genes',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 place-items-center items-center px-6'>
        <h1 className='data-table-title col-start-2'>Genes</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Gene'
          fields={fields as Array<FieldType<db_Gene>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;

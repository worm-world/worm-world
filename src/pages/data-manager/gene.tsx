import { useEffect, useState } from 'react';
import { getFilteredGenes, insertDbGene } from 'api/gene';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_Gene } from 'models/db/db_Gene';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';
import { chromosomeOptions } from 'models/frontend/Gene';

export const cols: Array<ColumnDefinitionType<db_Gene>> = [
  { key: 'name', header: 'Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const fields = [
  {
    name: 'name',
    title: 'Name',
    type: 'text',
  },
  {
    name: 'chromosome',
    title: 'Chromosome Number',
    type: 'select',
    selectOptions: chromosomeOptions,
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
  const onRecordInsertionFormSubmission = (record: db_Gene): void => {
    insertDbGene(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast(`An error has occured when inserting data: ${e}`);
      });
  };

  const refresh = (): void => {
    getFilteredGenes({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get genes: ' + e.message, { toastId: 'genes' })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Gene</h1>
      <DataImportForm
        dataName='Gene'
        fields={fields as Array<FieldType<db_Gene>>}
        onSubmitCallback={onRecordInsertionFormSubmission}
      ></DataImportForm>
      <br />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;

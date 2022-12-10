import { useEffect, useState } from 'react';
import { getFilteredAlleles, insertDbAllele } from 'api/allele';
import { toast } from 'react-toastify';
import { db_Allele } from 'models/db/db_Allele';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';

export const cols: Array<ColumnDefinitionType<db_Allele>> = [
  { key: 'name', header: 'Name' },
  { key: 'geneName', header: 'Gene Name' },
  { key: 'variationName', header: 'Variation Name' },
  { key: 'contents', header: 'Contents' },
];
const fields = [
  {
    name: 'name',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'contents',
    title: 'Allele Contents',
    type: 'text',
  },
  {
    name: 'geneName',
    title: 'Gene Name',
    type: 'text',
  },
  {
    name: 'variationName',
    title: 'Variation Name',
    type: 'text',
  },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Allele[]>([]);
  const onRecordInsertionFormSubmission = (record: db_Allele): void => {
    insertDbAllele(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast.error('An error has occured when inserting data: ' + JSON.stringify(e));
      });
  };
  const refresh = (): void => {
    getFilteredAlleles({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch(e =>
        toast.error('Unable to get alleles: ' + JSON.stringify(e), {
          toastId: 'alleles',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 items-center px-6 place-items-center'>
        <h1 className='data-table-title col-start-2'>Alleles</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Allele'
          fields={fields as Array<FieldType<db_Allele>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

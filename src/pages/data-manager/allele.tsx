import { useEffect, useState } from 'react';
import { getFilteredAlleles, insertDbAllele } from 'api/allele';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        toast(`An error has occured when inserting data: ${e}`);
      });
  };
  const refresh = (): void => {
    getFilteredAlleles({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get alleles: ' + e.message, {
          toastId: 'alleles',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Alleles</h1>
      <DataImportForm
        dataName='Allele'
        fields={fields as Array<FieldType<db_Allele>>}
        onSubmitCallback={onRecordInsertionFormSubmission}
      ></DataImportForm>
      <br />
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

import { useEffect, useState } from 'react';
import { getFilteredVariations, insertDbVariation } from 'api/variationInfo';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';
import { chromosomeOptions } from 'models/frontend/Gene';

export const cols: Array<ColumnDefinitionType<db_VariationInfo>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const fields = [
  {
    name: 'alleleName',
    title: 'Allele Name',
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
  const [data, setData] = useState<db_VariationInfo[]>([]);
  const onRecordInsertionFormSubmission = (record: db_VariationInfo): void => {
    insertDbVariation(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast(`An error has occured when inserting data: ${e}`);
      });
  };

  const refresh = (): void => {
    getFilteredVariations({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get variations: ' + e.message, {
          toastId: 'variations',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Variations</h1>
      <DataImportForm
        dataName='Variation'
        fields={fields as Array<FieldType<db_VariationInfo>>}
        onSubmitCallback={onRecordInsertionFormSubmission}
      ></DataImportForm>
      <br />
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

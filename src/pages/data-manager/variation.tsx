import { useEffect, useState } from 'react';
import { getFilteredVariations, insertDbVariation } from 'api/variationInfo';
import { toast } from 'react-toastify';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';
import { chromosomes } from 'models/frontend/Mutation';

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
  const [data, setData] = useState<db_VariationInfo[]>([]);
  const onRecordInsertionFormSubmission = (record: db_VariationInfo): void => {
    insertDbVariation(record)
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
    getFilteredVariations({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error(
          <div>{'Unable to get variations:' + JSON.stringify(e)}</div>,
          {
            toastId: 'variations',
          }
        )
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 place-items-center items-center px-6'>
        <h1 className='data-table-title col-start-2'>Variations</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Variation'
          fields={fields as Array<FieldType<db_VariationInfo>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

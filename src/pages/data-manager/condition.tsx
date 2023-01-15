import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db_Condition } from 'models/db/db_Condition';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import { getFilteredConditions, insertDbCondition } from 'api/condition';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';

export const cols: Array<ColumnDefinitionType<db_Condition>> = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'maleMating', header: 'Male Mating' },
  { key: 'lethal', header: 'Lethal' },
  { key: 'femaleSterile', header: 'Female Sterile' },
  { key: 'arrested', header: 'Arrested' },
  { key: 'maturationDays', header: 'Maturation Days' },
];

const fields = [
  {
    name: 'name',
    title: 'Condition Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    name: 'maleMating',
    title: 'Male Mating',
    type: 'number',
  },
  {
    name: 'lethal',
    title: 'Lethal Condition',
    type: 'boolean',
  },
  {
    name: 'femaleSterile',
    title: 'Female Sterile',
    type: 'boolean',
  },
  {
    name: 'arrested',
    title: 'Arrested',
    type: 'boolean',
  },
  {
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Condition[]>([]);
  const onRecordInsertionFormSubmission = (
    record: db_Condition,
    successCallback: () => void
  ): void => {
    insertDbCondition(record)
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
    getFilteredConditions({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error('Unable to get conditions: ' + JSON.stringify(e), {
          toastId: 'conditions',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 place-items-center items-center px-6'>
        <h1 className='data-table-title col-start-2'>Conditions</h1>
        <DataImportForm
          className='justify-self-end'
          dataName='Condition'
          fields={fields as Array<FieldType<db_Condition>>}
          onSubmitCallback={onRecordInsertionFormSubmission}
        ></DataImportForm>
      </div>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import { FaFilter } from 'react-icons/fa';
import DataImportForm from 'components/DataImportForm/DataImportForm';
import { Field } from 'components/Table/ColumnFilter';
import { Filter } from 'models/db/filter/Filter';

interface iDataPageProps<T, K> {
  title: string;
  dataName: string;
  cols: Array<ColumnDefinitionType<T>>;
  fields: Array<Field<T>>;
  nameMapping: { [key in keyof T]: K };
  insertDatum: (record: T) => Promise<void>;
  getFilteredData: (filterObj: Filter<K>) => Promise<T[]>;
}

const DataPage = <T, K>(props: iDataPageProps<T, K>): JSX.Element => {
  const [data, setData] = useState<T[]>([]);
  const onRecordInsertionFormSubmission = (
    record: T,
    successCallback: () => void
  ): void => {
    props.insertDatum(record)
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

  const runFilters = (filterObj: Filter<K>): void => {
    props.getFilteredData(filterObj)
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error('Unable to get data: ' + JSON.stringify(e), {
          toastId: props.dataName,
        })
      );
  }

  const refresh = (): void => {
    runFilters({ filters: [], orderBy: [] });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className='drawer-content flex h-screen flex-col'>
      <div>
        <div className='grid grid-cols-3 place-items-center items-center px-6'>
          <h1 className='data-table-title col-start-2'>{props.title}</h1>
          <div className='w-full flex flex-row justify-end'>
            <DataImportForm
              className='justify-self-end'
              dataName={props.dataName}
              fields={props.fields}
              onSubmitCallback={onRecordInsertionFormSubmission}
            ></DataImportForm>
          </div>
        </div>
        <div className='px-4'>
          <Table runFilters={runFilters} nameMapping={props.nameMapping} data={data} columns={props.cols} fields={props.fields} />
        </div>
      </div>
    </div>
  );
};

export default DataPage;

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import DataImportForm from 'components/DataImportForm/DataImportForm';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { open } from '@tauri-apps/api/dialog';

interface iDataPageProps<T, K> {
  title: string;
  dataName: string;
  cols: Array<ColumnDefinitionType<T>>;
  fields: Array<Field<T>>;
  nameMapping: { [key in keyof T]: K };
  insertDatum: (record: T) => Promise<void>;
  getFilteredData: (filterObj: FilterGroup<K>) => Promise<T[]>;
  insertDataFromFile: (path: string) => Promise<void>;
}

const DataPage = <T, K>(props: iDataPageProps<T, K>): JSX.Element => {
  const [data, setData] = useState<T[]>([]);
  const onRecordInsertionFormSubmission = (
    record: T,
    successCallback: () => void
  ): void => {
    props
      .insertDatum(record)
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

  const importData = async () => {
    try {
      const filepath: string | null = (await open({
        filters: [
          {
            name: '',
            extensions: ['tsv', 'csv'],
          },
        ],
      })) as string | null;
      if (filepath === null) return;
      await props.insertDataFromFile(filepath);
      refresh();
      toast.success('Successfully imported data');
    } catch (e) {
      toast.error(
        'An error has occured when importing data: ' + JSON.stringify(e)
      );
    }
  };

  const runFilters = (filterObj: FilterGroup<K>): void => {
    props
      .getFilteredData(filterObj)
      .then((ds) => setData(ds))
      .catch((e) =>
        toast.error('Unable to get data: ' + JSON.stringify(e), {
          toastId: props.dataName,
        })
      );
  };

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
          <div className='flex w-full flex-row justify-end gap-2'>
            <DataImportForm
              title={props.title}
              className='justify-self-end'
              dataName={props.dataName}
              fields={props.fields}
              onSubmitCallback={onRecordInsertionFormSubmission}
            ></DataImportForm>
            <button className='btn' onClick={importData}>
              Import
            </button>
          </div>
        </div>
        <div className='px-4 pb-12'>
          <Table
            runFilters={runFilters}
            nameMapping={props.nameMapping}
            data={data}
            columns={props.cols}
            fields={props.fields}
          />
        </div>
      </div>
    </div>
  );
};

export default DataPage;

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

const rowsPerPage = 50;

const DataPage = <T, K>(props: iDataPageProps<T, K>): JSX.Element => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);

  const [curFilter, setCurFilter] = useState<FilterGroup<K>>({
    filters: [],
    orderBy: [],
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });
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

  const importData = async (): Promise<void> => {
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
    setCurFilter(filterObj);
    setPage(page => {
      props
        .getFilteredData({
          ...filterObj,
          limit: rowsPerPage,
          offset: page * rowsPerPage,
        })
        .then((ds) => setData(ds))
        .catch((e) =>
          toast.error('Unable to get data: ' + JSON.stringify(e), {
            toastId: props.dataName,
          })
        );
      return page;
    });
  };

  const refresh = (): void => {
    runFilters(curFilter);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className='drawer-content flex h-screen flex-col'>
      <div>
        <div className='grid grid-cols-3 place-items-center items-center px-6'>
          <div className='flex select-none flex-row justify-start pt-4'>
            {page > 0 && (
              <span
                className='cursor-pointer text-xl font-bold'
                onClick={() => {
                  setPage(page - 1);
                  refresh();
                }}
              >
                –
              </span>
            )}
            <span className='mx-2 pt-1'>Page {page + 1}</span>
            <span
              className='cursor-pointer text-xl font-bold'
              onClick={() => {
                setPage(page + 1);
                refresh();
              }}
            >
              +
            </span>
          </div>
          <h1 className='data-table-title col-start-2'>{props.title}</h1>
          <div className='flex w-full flex-row justify-end gap-2'>
            <DataImportForm
              title={props.title}
              className='justify-self-end'
              dataName={props.dataName}
              fields={props.fields}
              onSubmitCallback={onRecordInsertionFormSubmission}
            ></DataImportForm>
            <button
              className='btn'
              onClick={() => {
                importData().catch((error) => console.error(error));
              }}
            >
              Import
            </button>
          </div>
        </div>
        <div className='px-4 pb-12'>
          <Table
            runFilters={runFilters}
            nameMapping={props.nameMapping}
            data={data}
            offset={page * rowsPerPage}
            columns={props.cols}
            fields={props.fields}
          />
        </div>
      </div>
    </div>
  );
};

export default DataPage;

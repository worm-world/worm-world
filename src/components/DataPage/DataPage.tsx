import { open } from '@tauri-apps/api/dialog';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataImportForm from 'components/DataImportForm/DataImportForm';
import { Table, type ColumnDefinitionType } from 'components/Table/Table';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
interface iDataPageProps<T, K> {
  title: string;
  dataName: string;
  cols: Array<ColumnDefinitionType<T>>;
  fields: Array<Field<T>>;
  nameMapping: { [key in keyof T]: K };
  insertDatum: (record: T) => Promise<void>;
  getFilteredData: (filterObj: FilterGroup<K>) => Promise<T[]>;
  getCountFilteredData: (filterObj: FilterGroup<K>) => Promise<number>;
  insertDataFromFile: (path: string) => Promise<void>;
  deleteRecord: (row: T) => Promise<void>;
}

const rowsPerPage = 50;

const DataPage = <T, K>(props: iDataPageProps<T, K>): JSX.Element => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<number | undefined>(0);
  const [rowCount, setRowCount] = useState(0);

  const autoSize = (element: HTMLElement): void => {
    element.style.width = '0';
    const { borderLeftWidth, borderRightWidth } = getComputedStyle(element);
    /**
     * Turns a string like '36px' into the number 36
     */
    const numberPxToNumber = (numberPx: string): number =>
      parseInt(numberPx.slice(0, -2));
    const borderWidth =
      numberPxToNumber(borderLeftWidth) +
      numberPxToNumber(borderRightWidth) +
      17;
    // For some reason border is not included in scrollWidth
    element.style.width = `${element.scrollWidth + borderWidth}px`;
  };

  const [curFilter, setCurFilter] = useState<FilterGroup<K>>({
    filters: [],
    orderBy: [],
    limit: rowsPerPage,
    offset: (page ?? 0) * rowsPerPage,
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
        let eMsg = e.message;
        if (eMsg === 'undefined' || eMsg === undefined || eMsg === null)
          eMsg =
            'An error has occured when inserting data: ' + JSON.stringify(e);

        toast.error(eMsg);
      });
  };

  const deleteRecordCallback = (record: T): void => {
    props
      .deleteRecord(record)
      .then((_) => {
        refresh();
      })
      .catch((e: Error) => {
        toast.error(
          'An error occured when deleting a record: ' + JSON.stringify(e)
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
    setPage((page) => {
      props
        .getCountFilteredData(filterObj)
        .then((c) => {
          if ((page ?? 0) > Math.ceil(c / rowsPerPage)) setPage(undefined);
          props
            .getFilteredData({
              ...filterObj,
              limit: rowsPerPage,
              offset: (page ?? 0) * rowsPerPage,
            })
            .then((ds) => {
              setData(ds);
            })
            .catch((e) =>
              toast.error('Unable to get data: ' + JSON.stringify(e), {
                toastId: props.dataName,
              })
            );
          setRowCount(c);
        })
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
            <span className='mx-2 pt-1'>
              Page
              <input
                value={page !== undefined && rowCount > 0 ? page + 1 : ''}
                placeholder='1'
                type='number'
                className='ml-2 w-6 bg-base-200 text-right'
                onChange={(e) => {
                  if (e.target.value === '') {
                    setPage(undefined);
                    refresh();
                    return;
                  }
                  const newPage = parseInt(e.target.value);
                  if (
                    newPage > 0 &&
                    newPage <= Math.ceil(rowCount / rowsPerPage)
                  ) {
                    setPage(newPage - 1);
                    refresh();
                    autoSize(e.target);
                  }
                }}
              />
              <span className='opacity-60'>
                /{Math.ceil(rowCount / rowsPerPage)}
              </span>
            </span>
            <span className='ml-6 pt-2 text-sm opacity-60'>
              {rowCount > 0 ? rowCount.toLocaleString() + ' total rows' : ''}
            </span>
          </div>
          <h1 className='data-table-title col-start-2'>{props.title}</h1>
          <div className='flex w-full flex-row justify-end gap-2'>
            <DataImportForm
              title={props.title}
              className='justify-self-end'
              dataName={props.dataName}
              fields={props.fields}
              onSubmit={onRecordInsertionFormSubmission}
            ></DataImportForm>
            <button
              className='btn'
              onClick={() => {
                importData().catch((error) => {
                  console.error(error);
                });
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
            offset={(page ?? 0) * rowsPerPage}
            columns={props.cols}
            fields={props.fields}
            deleteRecord={deleteRecordCallback}
          />
        </div>
      </div>
    </div>
  );
};

export default DataPage;

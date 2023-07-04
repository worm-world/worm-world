import { open } from '@tauri-apps/api/dialog';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import DataImportForm from 'components/DataInputForm/DataInputForm';
import { Table, type ColumnDefinitionType } from 'components/Table/Table';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface DataTableProps<T, K> {
  title: string;
  dataName: string;
  cols: Array<ColumnDefinitionType<T>>;
  fields: Array<Field<T>>;
  nameMapping: { [key in keyof T]: K };
  insertRecord: (record: T) => Promise<void>;
  getFilteredRecords: (filterObj: FilterGroup<K>) => Promise<T[]>;
  getCountFilteredRecords: (filterObj: FilterGroup<K>) => Promise<number>;
  insertRecordsFromFile: (path: string) => Promise<void>;
  deleteRecord: (row: T) => Promise<void>;
  updateRecord?: (
    row: T,
    column: ColumnDefinitionType<T>,
    value: string
  ) => Promise<void>;
}

const rowsPerPage = 50;

const DataTable = <T, K>(props: DataTableProps<T, K>): JSX.Element => {
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
      .insertRecord(record)
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

  const deleteRecord = async (record: T): Promise<void> => {
    await props
      .deleteRecord(record)
      .then(() => {
        refresh();
      })
      .catch((e: Error) => {
        toast.error(`Unable to delete record: ${JSON.stringify(e)}`);
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
      await props.insertRecordsFromFile(filepath);
      refresh();
      toast.success('Successfully imported data');
    } catch (e) {
      toast.error(
        'An error has occured when importing data: ' + JSON.stringify(e)
      );
    }
  };

  const applyFilters = (filterObj: FilterGroup<K>): void => {
    setCurFilter(filterObj);
    setPage((page) => {
      props
        .getCountFilteredRecords(filterObj)
        .then((c) => {
          if ((page ?? 0) > Math.ceil(c / rowsPerPage)) setPage(undefined);
          props
            .getFilteredRecords({
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
    applyFilters(curFilter);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className='flex flex-col'>
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
        <h1 className='col-start-2 py-6 text-3xl font-bold'>{props.title}</h1>
        <div className='flex w-full flex-row justify-end gap-2'>
          <DataImportForm
            title={props.title}
            className='justify-self-end'
            dataName={props.dataName}
            fields={props.fields}
            onSubmit={onRecordInsertionFormSubmission}
          />
          <button
            className='btn'
            onClick={() => {
              importData().catch(console.error);
            }}
          >
            Import
          </button>
        </div>
      </div>
      <div className='px-4 pb-12'>
        <Table
          applyFilters={applyFilters}
          nameMapping={props.nameMapping}
          data={data}
          offset={(page ?? 0) * rowsPerPage}
          columns={props.cols}
          fields={props.fields}
          updateRecord={
            props.updateRecord === undefined
              ? undefined
              : async (row, column, value) => {
                  props.updateRecord?.(row, column, value).catch(console.error);
                  refresh();
                }
          }
          deleteRecord={deleteRecord}
        />
      </div>
    </div>
  );
};

export default DataTable;

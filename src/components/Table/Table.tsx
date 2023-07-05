import {
  type FilterGroup,
  type FilterTuple,
} from 'models/db/filter/FilterGroup';
import { type Filter } from 'models/db/filter/Filter';
import { type Order } from 'models/db/filter/Order';
import { useState } from 'react';
import {
  FaFilter as FilterIcon,
  FaSortDown as SortDownIcon,
  FaSortUp as SortUpIcon,
  FaTrash as TrashIcon,
} from 'react-icons/fa';
import {
  type Field,
  ColumnFilterModalBox,
} from 'components/ColumnFilter/ColumnFilter';

export interface ColumnDefinitionType<T> {
  key: keyof T;
  header: string;
  width?: number;
}

const SortIcon = (props: any): React.JSX.Element => {
  if (props.sortdir === 'Asc') {
    return <SortUpIcon {...props} />;
  } else {
    return <SortDownIcon {...props} />;
  }
};

interface TableHeaderCellProps<T> {
  column: ColumnDefinitionType<T>;
  index: number;
  sortType: SortTuple<T> | undefined;
  colFilters: Filter[];
  setSortType: (key: SortTuple<T>) => void;
  setFilterField: (key: keyof T) => void;
  applyFilters: (sortType?: SortTuple<T>) => void;
}

/**
 * TableHeaderCell is a generic component that appears in each column of the header of a table.
 * It displays the column header, and has a sort icon and filter icon when hovering.
 * The sort icon will display without hovering when this column is currently sorted.
 * The filter icon will display without hovering when this column has a filter applied.
 *
 * Clicking the sort icon will flip the sort direction and refresh the data.
 * Clicking the filter icon will open the filter modal for that column.
 *
 * This component is not stateful beside tracking if the cell is currently hovered.
 * It calls a parent component's stateful functions to update the sort type and filter field.
 */
const TableHeaderCell = <T,>(
  props: TableHeaderCellProps<T>
): React.JSX.Element => {
  const [hovered, setHovered] = useState<boolean>(false);
  const flipSortAndRun = (): void => {
    let sortType = props.sortType;
    if (sortType !== undefined && sortType[0] === props.column.key) {
      sortType = [props.column.key, sortType[1] === 'Asc' ? 'Desc' : 'Asc'];
    } else {
      sortType = [props.column.key, 'Asc'];
    }
    props.setSortType(sortType);
    props.applyFilters(sortType);
  };
  return (
    <th
      key={`headCell-${props.index}`}
      className='border-2 border-base-300 bg-base-200'
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseOut={() => {
        setHovered(false);
      }}
    >
      <div className='flex flex-row items-center justify-between'>
        <button
          onClick={flipSortAndRun}
          className='cursor-pointer text-xl transition-colors'
          title='sort-icon'
        >
          <SortIcon
            sortdir={props.sortType?.[1] ?? 'Asc'}
            visibility={
              hovered || props.sortType?.[0] === props.column.key
                ? ''
                : 'hidden'
            }
          />
        </button>
        <h2 className='px-1'>{props.column.header}</h2>
        <button
          className='m-0 cursor-pointer p-0'
          title='filter-icon'
          onClick={() => {
            props.setFilterField(props.column.key);
          }}
        >
          <FilterIcon
            visibility={hovered || props.colFilters.length > 0 ? '' : 'hidden'}
          />
        </button>
      </div>
    </th>
  );
};

interface TableHeaderProps<T> {
  columns: Array<ColumnDefinitionType<T>>;
  filterMap: Map<keyof T, Filter[]>;
  sortType?: SortTuple<T>;
  setSortType: (key: SortTuple<T>) => void;
  setFilterField: (key: keyof T) => void;
  applyFilters: () => void;
}

const TableHeader = <T,>(props: TableHeaderProps<T>): React.JSX.Element => {
  const headers = props.columns.map((column, index) => {
    return (
      <TableHeaderCell
        applyFilters={props.applyFilters}
        key={index}
        setFilterField={props.setFilterField}
        sortType={props.sortType}
        setSortType={props.setSortType}
        column={column}
        index={index}
        colFilters={props.filterMap.get(column.key) ?? []}
      />
    );
  });

  const rowNumCol = <th className='m-0 rounded-none'></th>;
  const deleteCol = rowNumCol;

  return (
    <thead>
      <tr className='rounded-none border-none'>
        {rowNumCol}
        {headers}
        {deleteCol}
      </tr>
    </thead>
  );
};

interface TableRowsProps<T> {
  data: T[];
  columns: Array<ColumnDefinitionType<T>>;
  deleteRecord: (row: T) => Promise<void>;
  updateRecord?: (
    row: T,
    column: ColumnDefinitionType<T>,
    value: string
  ) => Promise<void>;
  offset?: number;
}

const formatData = (d: any): string => {
  if (d === null) return '';
  else return String(d);
};

interface DeleteCellProps {
  deleteRecord: () => Promise<void>;
}

const DeleteCell = (props: DeleteCellProps): React.JSX.Element => {
  return (
    <td
      className='text-error hover:cursor-pointer'
      onClick={() => {
        Promise.resolve(
          window.confirm('Are you sure you want to delete this row?')
        )
          .then(async (confirmed: boolean) => {
            if (confirmed) {
              await props.deleteRecord();
            }
          })
          .catch(console.error);
      }}
    >
      <TrashIcon />
    </td>
  );
};

interface CellProps<T> {
  index: number;
  row: T;
  column: ColumnDefinitionType<T>;
  updateRecord?: (
    row: T,
    column: ColumnDefinitionType<T>,
    value: string
  ) => Promise<void>;
}

const Cell = <T,>(props: CellProps<T>): React.JSX.Element => {
  const cellValue = formatData(props.row[props.column.key]);
  const isEditable = props.updateRecord !== undefined;
  const [isActive, setIsActive] = useState(false);
  const [userInput, setUserInput] = useState(cellValue);
  const onSubmit = (): void => {
    setIsActive(false);
    if (userInput !== cellValue)
      props
        .updateRecord?.(props.row, props.column, userInput)
        .catch(console.error);
  };
  return (
    <td
      className={`h-full w-full border-2 border-base-300 p-2 ${
        isEditable && 'hover:cursor-pointer'
      } ${isActive && 'border-4'}`}
      onClick={() => {
        isEditable && setIsActive(true);
      }}
    >
      {isActive ? (
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          onBlur={onSubmit}
          className='h-full w-full p-0'
          autoFocus
        />
      ) : (
        formatData(props.row[props.column.key])
      )}
    </td>
  );
};

const TableRows = <T,>({
  data,
  columns,
  offset,
  deleteRecord,
  updateRecord,
}: TableRowsProps<T>): React.JSX.Element => {
  const rows = data.map((row, rowIndex) => {
    return (
      <tr key={`row-${rowIndex}`} className='rounded-none border-none'>
        <td className='m-1 w-4 border-2 bg-base-200 pr-3 font-bold'>
          {rowIndex + (offset ?? 0) + 1 /* for 1-based indexing */}
        </td>
        {columns.map((column, columnIndex) => (
          <Cell
            key={`cell-${columnIndex}`}
            row={row}
            column={column}
            index={columnIndex}
            updateRecord={updateRecord}
          />
        ))}
        <DeleteCell
          deleteRecord={async () => {
            await deleteRecord(row).catch(console.error);
          }}
        />
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

export interface TableProps<T, K> {
  nameMapping: { [key in keyof T]: K };
  data: T[];
  fields: Array<Field<T>>;
  columns: Array<ColumnDefinitionType<T>>;
  applyFilters: (filterObj: FilterGroup<K>) => void;
  offset?: number;
  updateRecord?: (
    row: T,
    column: ColumnDefinitionType<T>,
    value: string
  ) => Promise<void>;
  deleteRecord: (row: T) => Promise<void>;
}

type FilterMap<T> = Map<keyof T, Filter[]>;
type SortTuple<T> = [keyof T, Order];

/**
 * The Table component is the main component for the table.
 * It is responsible for managing all the state for sorting & filtering of the table.
 * The data is passed in as a prop.
 *
 * Table is generic over the type of the data and the type of the name mapping.
 * It uses a name mapping to map the column names of the data fields to the column names of filters in the FilterGroup.
 *
 * It passes stateful functions down to its children components to update the sort & filtering states.
 * For example, the TableHeaderCell component will call the setSortType function to update the sort type.
 * The ColumnFilter component will call the setFilterMapItem function to update the filter map.
 *
 * It can construct a full FilterGroup object from the state and pass it to the prop applyFilters function
 * to run filters on the data.
 */
export const Table = <T, K>(props: TableProps<T, K>): React.JSX.Element => {
  const [filterMap, setFilterMap] = useState<FilterMap<T>>(new Map());
  const [sortType, setSortType] = useState<SortTuple<T> | undefined>(undefined);
  const [focusedFilterField, setFocusedFilterField] = useState<
    keyof T | undefined
  >(undefined);
  const setFilterMapItem = (key: keyof T, value: Filter[]): void => {
    const newFilterMap = new Map(filterMap);
    if (value.length === 0) {
      newFilterMap.delete(key);
    } else {
      newFilterMap.set(key, value);
    }
    setFilterMap(newFilterMap);
  };
  const createFilterGroup = (sortType?: SortTuple<T>): FilterGroup<K> => {
    const filters = new Array<Array<FilterTuple<K>>>();
    filterMap.forEach((filterTypes, key) => {
      const filter = new Array<FilterTuple<K>>();
      filterTypes.forEach((filterType) => {
        filter.push([props.nameMapping[key], filterType]);
      });
      filters.push(filter);
    });
    const orderBy =
      sortType !== undefined
        ? new Array<[K, Order]>([
            props.nameMapping[sortType[0]] as K,
            sortType[1],
          ])
        : new Array<[K, Order]>();
    const filterObj = {
      filters,
      orderBy,
    };
    return filterObj;
  };

  const applyFilters = (sortType?: SortTuple<T>): void => {
    props.applyFilters(createFilterGroup(sortType));
  };

  return (
    <div className='m-auto flex w-full flex-col overflow-x-auto'>
      <table className='table-compact m-auto table w-min p-5'>
        <TableHeader
          applyFilters={applyFilters}
          columns={props.columns}
          filterMap={filterMap}
          sortType={sortType}
          setSortType={setSortType}
          setFilterField={setFocusedFilterField}
        />
        <TableRows
          data={props.data}
          columns={props.columns}
          offset={props.offset}
          deleteRecord={props.deleteRecord}
          updateRecord={props.updateRecord}
        />
      </table>
      <input
        type='checkbox'
        id='my-filter-modal'
        className='modal-toggle'
        checked={focusedFilterField !== undefined}
        readOnly
      />
      <label htmlFor='my-filter-modal' className='modal cursor-pointer'>
        <div
          className='absolute h-full w-full'
          onClick={() => {
            setFocusedFilterField(undefined);
            applyFilters();
          }}
        />
        {focusedFilterField !== undefined && (
          <ColumnFilterModalBox
            field={props.fields.find((f) => f.name === focusedFilterField)}
            columnFilters={filterMap.get(focusedFilterField) ?? []}
            setColumnFilters={(filter) => {
              setFilterMapItem(focusedFilterField, filter);
            }}
          />
        )}
      </label>
    </div>
  );
};

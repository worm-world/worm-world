import { Filter, FilterTuple } from 'models/db/filter/Filter';
import { FilterType } from 'models/db/filter/FilterType';
import { Order } from 'models/db/filter/Order';
import { ReactNode, useState } from 'react';
import { FaFilter, FaSortDown, FaSortUp } from 'react-icons/fa';
import { ColumnFilter, Field } from '../ColumnFilter/ColumnFilter';

export interface ColumnDefinitionType<T> {
  key: keyof T;
  header: string;
  width?: number;
}

const SortIcon = (props: any): JSX.Element => {
  if (props.sortdir === 'Asc') {
    return <FaSortUp {...props} />;
  } else {
    return <FaSortDown {...props} />;
  }
};

interface TableHeaderCellProps<T> {
  column: ColumnDefinitionType<T>;
  index: number;
  sortType: SortType<T> | undefined;
  colFilter: FilterType[];
  setSortType: (key: SortType<T>) => void;
  setFilterField: (key: keyof T) => void;
  runMyFilters: () => void;
}

const TableHeaderCell = <T,>(props: TableHeaderCellProps<T>): JSX.Element => {
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <th
      key={`headCell-${props.index}`}
      className='py-1font-normal border-2 border-base-content bg-primary px-2 text-primary-content shadow-md'
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <div className='flex flex-row items-center justify-between'>
        <SortIcon
          onClick={() => {
            if (props.sortType?.[0] === props.column.key) {
              props.setSortType([
                props.column.key,
                props.sortType[1] === 'Asc' ? 'Desc' : 'Asc',
              ]);
            } else {
              props.setSortType([props.column.key, 'Asc']);
            }
            props.runMyFilters();
          }}
          className='cursor-pointer text-xl transition-colors'
          sortdir={props.sortType?.[1] ?? 'Asc'}
          visibility={
            hovered || props.sortType?.[0] === props.column.key ? '' : 'hidden'
          }
        />
        <h2 className='px-1 text-2xl'>{props.column.header}</h2>
        <FaFilter
          className={'cursor-pointer'}
          visibility={hovered || props.colFilter.length > 0 ? '' : 'hidden'}
          onClick={() => {
            props.setFilterField(props.column.key);
          }}
        />
      </div>
    </th>
  );
};

interface TableHeaderProps<T> {
  columns: Array<ColumnDefinitionType<T>>;
  filterMap: Map<keyof T, FilterType[]>;
  sortType?: SortType<T>;
  setSortType: (key: SortType<T>) => void;
  setFilterField: (key: keyof T) => void;
  runMyFilters: () => void;
}

const TableHeader = <T,>(props: TableHeaderProps<T>): JSX.Element => {
  const headers = props.columns.map((column, index) => {
    return (
      <TableHeaderCell
        runMyFilters={props.runMyFilters}
        key={index}
        setFilterField={props.setFilterField}
        sortType={props.sortType}
        setSortType={props.setSortType}
        column={column}
        index={index}
        colFilter={props.filterMap.get(column.key) ?? []}
      />
    );
  });
  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
};

interface TableRowsProps<T> {
  data: T[];
  columns: Array<ColumnDefinitionType<T>>;
}

const formatData = (d: any): ReactNode => {
  if (typeof d === 'boolean') {
    return d ? 'True' : 'False';
  }
  return d as ReactNode;
};

const TableRows = <T,>({ data, columns }: TableRowsProps<T>): JSX.Element => {
  const rows = data.map((row, index) => {
    return (
      <tr key={`row-${index}`}>
        {columns.map((column, index2) => {
          return (
            <td
              key={`cell-${index2}`}
              className={`border-2 border-base-content px-2 py-1 ${
                row[column.key] == null ? 'bg-base-300' : ''
              }`}
            >
              {formatData(row[column.key])}
            </td>
          );
        })}
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
  runFilters: (filterObj: Filter<K>) => void;
}

type FilterMap<T> = Map<keyof T, FilterType[]>;
type SortType<T> = [keyof T, Order];

export const Table = <T, K>(props: TableProps<T, K>): JSX.Element => {
  const [filterMap, setFilterMap] = useState<FilterMap<T>>(new Map());
  const [sortType, setSortType] = useState<SortType<T> | undefined>(undefined);
  const [focusedFilterField, setFocusedFilterField] = useState<
    keyof T | undefined
  >(undefined);
  const setFilterMapItem = (key: keyof T, value: FilterType[]): void => {
    const newFilterMap = new Map(filterMap);
    if (value.length === 0) {
      newFilterMap.delete(key);
    } else {
      newFilterMap.set(key, value);
    }
    setFilterMap(newFilterMap);
  };
  const createFilters = (): Filter<K> => {
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

  const runMyFilters = (): void => {
    props.runFilters(createFilters());
  };

  return (
    <>
      <table className='w-full'>
        <TableHeader
          runMyFilters={runMyFilters}
          columns={props.columns}
          filterMap={filterMap}
          sortType={sortType}
          setSortType={setSortType}
          setFilterField={setFocusedFilterField}
        />
        <TableRows data={props.data} columns={props.columns} />
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
            runMyFilters();
          }}
        />
        <div className='modal-box bg-base-200'>
          {focusedFilterField !== undefined && (
            <ColumnFilter
              field={props.fields.find((f) => f.name === focusedFilterField)}
              filterTypes={filterMap.get(focusedFilterField) ?? []}
              setFilterTypes={(filter) => {
                setFilterMapItem(focusedFilterField, filter);
              }}
            />
          )}
        </div>
      </label>
    </>
  );
};

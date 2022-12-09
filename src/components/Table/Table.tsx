import { ReactNode } from 'react';

export interface ColumnDefinitionType<T> {
  key: keyof T;
  header: string;
  width?: number;
}

interface TableProps<T> {
  data: T[];
  columns: Array<ColumnDefinitionType<T>>;
}

interface TableHeaderProps<T> {
  columns: Array<ColumnDefinitionType<T>>;
}

const TableHeader = <T,>({ columns }: TableHeaderProps<T>): JSX.Element => {
  const headers = columns.map((column, index) => {
    return (
      <th
        key={`headCell-${index}`}
        className='text-2xl font-normal border border-2 border-zinc-600 px-2 py-1 bg-zinc-900'
      >
        {column.header}
      </th>
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
              className={`border border-2 border-zinc-600 px-2 py-1 ${
                row[column.key] == null ? 'bg-zinc-800' : ''
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

export const Table = <T,>({ data, columns }: TableProps<T>): JSX.Element => {
  return (
    <>
      <table className='w-full'>
        <TableHeader columns={columns} />
        <TableRows data={data} columns={columns} />
      </table>
    </>
  );
};

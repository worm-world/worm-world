import { render, screen } from '@testing-library/react';
import { Table } from 'components/Table/Table';
import { cols as alleleCols } from 'pages/data-manager/allele';
import { db_Allele } from 'models/db/db_Allele';

const alleleData: db_Allele[] = [
  {
    name: 'allele1',
    sysGeneName: 'gene1',
    variationName: null,
    contents: null,
  },
  {
    name: 'allele2',
    sysGeneName: 'gene1',
    variationName: null,
    contents: null,
  },
  {
    name: 'allele1',
    sysGeneName: null,
    variationName: 'variation1',
    contents: null,
  },
];

describe('Table component', () => {
  test('successfully renders', () => {
    render(<Table data={alleleData} columns={alleleCols} />);

    const table = screen.getByRole('table');
    expect(table).toBeDefined();
  });

  test('displays listed columns', () => {
    render(<Table data={alleleData} columns={alleleCols} />);
    const colHeaders = screen.getAllByRole('columnheader');
    expect(colHeaders).toHaveLength(alleleCols.length);

    alleleCols.forEach((col) => {
      const colHeader = screen.getByRole('columnheader', { name: col.header });
      expect(colHeader).toBeDefined();
    });
  });

  test('displays inputted row data', () => {
    render(<Table data={alleleData} columns={alleleCols} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(alleleData.length + 1); // include col header row
    rows.shift(); // only consider row data

    rows.forEach((row, idx) => {
      const rowData = alleleData[idx];
      const correctContent = Object.entries(rowData)
        .map(([_, val]) => val ?? '')
        .join('');

      expect(row).toHaveTextContent(correctContent);
    });
  });

  test('can handle empty row data', () => {
    render(<Table data={[]} columns={alleleCols} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(alleleCols.length);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});

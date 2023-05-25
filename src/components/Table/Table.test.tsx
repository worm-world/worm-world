import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ColumnDefinitionType, Table } from 'components/Table/Table';
import { cols as alleleCols } from 'pages/data-tables/alleles';
import { db_Allele } from 'models/db/db_Allele';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';

const invisibleColHeaderCt = 2;

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

export const cols: Array<ColumnDefinitionType<db_Allele>> = [
  { key: 'name', header: 'Name' },
  { key: 'sysGeneName', header: 'Systematic Gene Name' },
  { key: 'variationName', header: 'Variation Name' },
  { key: 'contents', header: 'Contents' },
];

const fields: Array<Field<db_Allele>> = [
  {
    name: 'name',
    title: 'Allele Name',
    type: 'text',
  },
  {
    name: 'contents',
    title: 'Allele Contents',
    type: 'text',
  },
  {
    name: 'sysGeneName',
    title: 'Systematic Gene Name',
    type: 'text',
  },
  {
    name: 'variationName',
    title: 'Variation Name',
    type: 'text',
  },
];

const nameMapping: { [key in keyof db_Allele]: AlleleFieldName } = {
  name: 'Name',
  sysGeneName: 'SysGeneName',
  variationName: 'VariationName',
  contents: 'Contents',
};

describe('Table component', () => {
  test('successfully renders', () => {
    const runFilters = vi.fn();
    render(
      <Table
        data={alleleData}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeDefined();
  });

  test('displays listed columns', () => {
    const runFilters = vi.fn();
    render(
      <Table
        data={alleleData}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );
    const colHeaders = screen.getAllByRole('columnheader');
    expect(colHeaders).toHaveLength(alleleCols.length + invisibleColHeaderCt);

    alleleCols.forEach((col, i) => {
      if (i > 0) {
        const colHeader = screen.getByRole('columnheader', {
          name: col.header,
        });
        expect(colHeader).toBeDefined();
      }
    });
  });

  test('displays inputted row data', () => {
    const runFilters = vi.fn();
    render(
      <Table
        data={alleleData}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );
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
    const runFilters = vi.fn();
    render(
      <Table
        data={[]}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(alleleCols.length + invisibleColHeaderCt);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
    expect(runFilters).not.toBeCalled();
  });

  test('hovering header shows filter icon', async () => {
    userEvent.setup();
    const runFilters = vi.fn();
    render(
      <Table
        data={[]}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(alleleCols.length + invisibleColHeaderCt);

    await userEvent.hover(headers[0]);

    const filterButtons = screen.getAllByRole('button', {
      name: 'filter-icon',
    });

    expect(filterButtons[0].firstChild).toBeVisible();
  });

  test('clicking sort calls runFilters', async () => {
    userEvent.setup();
    const runFilters = vi.fn();
    render(
      <Table
        data={[]}
        columns={alleleCols}
        nameMapping={nameMapping}
        fields={fields}
        runFilters={runFilters}
        deleteRecord={() => {}}
      />
    );
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(alleleCols.length + invisibleColHeaderCt);

    await userEvent.hover(headers[0]);

    const sortButtons = screen.getAllByRole('button', { name: 'sort-icon' });
    expect(runFilters).not.toBeCalled();
    await userEvent.click(sortButtons[0]);
    expect(runFilters).toBeCalled();
  });
});

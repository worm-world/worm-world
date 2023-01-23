import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Table, TableProps } from 'components/Table/Table';
import { cols as alleleCols } from 'pages/data-manager/allele';
import { db_Allele } from 'models/db/db_Allele';

export default {
  title: 'Components/Table',
  component: Table,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Table>;

const Template =
  <T,>(): StoryFn<TableProps<T>> =>
  (props) =>
    <Table {...props} />;

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

export const Primary = Template<db_Allele>().bind({});
Primary.args = { columns: alleleCols, data: alleleData };

export const NoRowData = Template<db_Allele>().bind({});
NoRowData.args = { columns: alleleCols, data: [] };

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ColumnDefinitionType, Table, TableProps } from 'components/Table/Table';
import { cols as alleleCols } from 'pages/data-manager/allele';
import { db_Allele } from 'models/db/db_Allele';
import { Field } from '../ColumnFilter/ColumnFilter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';

export default {
  title: 'Components/Table',
  component: Table,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Table>;

const Template =
  <T,K>(): StoryFn<TableProps<T, K>> =>
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

export const Primary = Template<db_Allele, AlleleFieldName>().bind({});
Primary.args = { columns: alleleCols, data: alleleData, nameMapping, fields};

export const NoRowData = Template<db_Allele, AlleleFieldName>().bind({});
NoRowData.args = { columns: alleleCols, data: [], nameMapping, fields };

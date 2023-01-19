import React from 'react';
import { StoryFn, Meta, Story } from '@storybook/react';
import {
  DynamicSearch,
  iSearchProps,
} from 'components/DynamicSearch/DynamicSearch';
import { Filter } from 'models/db/filter/Filter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { db_Allele } from 'models/db/db_Allele';
import { getDbAlleles } from 'components/DynamicSearch/DynamicSearch.mock';
import { T } from 'vitest/dist/global-732f9b14';

export default {
  title: 'Components/DynamicSearch',
  component: DynamicSearch,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof DynamicSearch>;

const Template =
  <T, U>(): StoryFn<iSearchProps<T, U>> =>
  (props) =>
    <DynamicSearch {...props} />;

const getAlleleApi = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[]> => {
  return getDbAlleles().filter((allele) =>
    allele.name.includes((filter.filters[0][0][1] as any)['Like'] as string)
  );
};

export const BasicSearch = Template<AlleleFieldName, db_Allele>().bind({});
const primaryProps: iSearchProps<AlleleFieldName, db_Allele> = {
  getFilteredRecordApi: getAlleleApi,
  searchOn: 'Name',
  selectInputOn: 'name',
  displayResultsOn: ['name'],
  placeholder: 'search alleles',
};
BasicSearch.args = primaryProps;

export const NoPlaceholder = Template<AlleleFieldName, db_Allele>().bind({});
const noPlaceholderProps: iSearchProps<AlleleFieldName, db_Allele> = {
  getFilteredRecordApi: getAlleleApi,
  searchOn: 'Name',
  selectInputOn: 'name',
  displayResultsOn: ['name'],
};
NoPlaceholder.args = noPlaceholderProps;

export const ExtraDisplayOn = Template<AlleleFieldName, db_Allele>().bind({});
const extraResultDisplayProps: iSearchProps<AlleleFieldName, db_Allele> = {
  getFilteredRecordApi: getAlleleApi,
  searchOn: 'Name',
  selectInputOn: 'name',
  displayResultsOn: ['name', 'sysGeneName'],
  placeholder: 'search alleles',
};
ExtraDisplayOn.args = extraResultDisplayProps;

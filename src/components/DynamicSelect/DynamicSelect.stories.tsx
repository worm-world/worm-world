import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import {
  DynamicSelect,
  DynamicSelectProps,
} from 'components/DynamicSelect/DynamicSelect';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { db_Allele } from 'models/db/db_Allele';
import { getDbAlleles } from 'components/DynamicSelect/DynamicSelect.mock';

export default {
  title: 'Components/DynamicSelect',
  component: DynamicSelect,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof DynamicSelect>;

const Template =
  <T, U>(): StoryFn<DynamicSelectProps<T, U>> =>
  (props) =>
    <DynamicSelect {...props} />;

const getAlleleApi = async (
  filter: FilterGroup<AlleleFieldName>
): Promise<db_Allele[]> => {
  return getDbAlleles().filter((allele) =>
    allele.name.includes((filter.filters[0][0][1] as any)['Like'] as string)
  );
};

export const BasicSearch = Template<AlleleFieldName, db_Allele>().bind({});
const primaryProps: DynamicSelectProps<AlleleFieldName, db_Allele> = {
  getFilteredRecord: getAlleleApi,
  searchOn: 'Name',
  selectInputOn: 'name',
  fieldsToDisplay: ['name'],
  placeholder: 'search alleles',
  selectedRecord: undefined,
  setSelectedRecord: function (record: db_Allele | undefined): void {
    throw new Error('Function not implemented.');
  },
};
BasicSearch.args = primaryProps;

export const NoPlaceholder = Template<AlleleFieldName, db_Allele>().bind({});
const noPlaceholderProps: DynamicSelectProps<AlleleFieldName, db_Allele> = {
  getFilteredRecord: getAlleleApi,
  searchOn: 'Name',
  selectInputOn: 'name',
  fieldsToDisplay: ['name'],
  selectedRecord: undefined,
  setSelectedRecord: function (record: db_Allele | undefined): void {
    throw new Error('Function not implemented.');
  },
};
NoPlaceholder.args = noPlaceholderProps;

export const ExtraDisplayOn = Template<AlleleFieldName, db_Allele>().bind({});
const extraResultDisplayProps: DynamicSelectProps<AlleleFieldName, db_Allele> =
  {
    getFilteredRecord: getAlleleApi,
    searchOn: 'Name',
    selectInputOn: 'name',
    fieldsToDisplay: ['name', 'sysGeneName'],
    placeholder: 'search alleles',
    selectedRecord: undefined,
    setSelectedRecord: function (record: db_Allele | undefined): void {
      throw new Error('Function not implemented.');
    },
  };
ExtraDisplayOn.args = extraResultDisplayProps;

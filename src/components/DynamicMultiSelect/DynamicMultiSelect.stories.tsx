import { DynamicMultiSelect, iDynamicMultiSelect } from './DynamicMultiSelect';
import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Filter } from 'models/db/filter/Filter';

type StringWrapper = { field: string };

const testRecords: StringWrapper[] = [
  { field: 'alpha' },
  { field: 'bravo' },
  { field: 'charlie' },
  { field: 'delta' },
  { field: 'echo' },
  { field: 'foxtrot' },
  { field: 'golf' },
  { field: 'hotel' },
  { field: 'india' },
  { field: 'juliett' },
  { field: 'kilo' },
  { field: 'lima' },
  { field: 'mike' },
  { field: 'november' },
  { field: 'oscar' },
  { field: 'papa' },
  { field: 'quebec' },
  { field: 'romeo' },
  { field: 'sierra' },
  { field: 'tango' },
  { field: 'uniform' },
  { field: 'victor' },
  { field: 'whiskey' },
  { field: 'x-ray' },
  { field: 'yankee' },
  { field: 'zulu' },
];

const getFilteredRecordApi = (
  filter: Filter<string>
): Promise<StringWrapper[]> => {
  const expr = filter.filters.at(0)?.at(0)?.at(1) as { Like: string };
  const filtered = testRecords.filter((record) => {
    return record.field.toLowerCase().includes(expr.Like.toLowerCase());
  });
  return Promise.resolve(filtered);
};

interface MockDynamicMultiSelectProps {
  shouldInclude?: (option: StringWrapper) => boolean;
}

const MockDynamicMultiSelect = (
  props: MockDynamicMultiSelectProps
): JSX.Element => {
  const [selectedRecords, setSelectedRecords] = useState(
    new Set<StringWrapper>()
  );

  return (
    <DynamicMultiSelect
      placeholder='Placeholder'
      getFilteredRecordApi={getFilteredRecordApi}
      searchOn={'field'}
      selectInputOn={'field'}
      displayResultsOn={['field']}
      label='Label'
      selectedRecords={selectedRecords}
      setSelectedRecords={setSelectedRecords}
      shouldInclude={props.shouldInclude}
    />
  );
};

export default {
  title: 'Components/DynamicMultiSelect',
  component: DynamicMultiSelect,
} as Meta<typeof MockDynamicMultiSelect>;

const Template: StoryFn<typeof MockDynamicMultiSelect> = (
  args: MockDynamicMultiSelectProps
) => {
  return <MockDynamicMultiSelect {...args} />;
};

export const primary = Template.bind({});
primary.args = {};

export const mustIncludeLetterE = Template.bind({});
const args: MockDynamicMultiSelectProps = {
  shouldInclude: (option: StringWrapper) =>
    option.field.toLowerCase().includes('e'),
};
mustIncludeLetterE.args = args;

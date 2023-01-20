import { StoryFn, Meta } from '@storybook/react';
import SelectedPill, {
  SelectedPillProps,
  getSelectedPills,
} from 'components/DynamicMultiSelect/SelectedPill';
import { useState } from 'react';

type StringWrapper = { field: string };

const MockSelectedPill = (): JSX.Element => {
  const [selectedRecords, setSelectedRecords] = useState(
    new Set<StringWrapper>([{ field: 'text  here' }])
  );
  const removeFromSelected = (val: StringWrapper) => {
    const newSelectedRecords = new Set(selectedRecords);
    newSelectedRecords.delete(val);
    setSelectedRecords(newSelectedRecords);
  };

  return getSelectedPills(selectedRecords, removeFromSelected, ['field'])[0];
};

export default {
  title: 'Components/SelectedPill',
  component: MockSelectedPill,
} as Meta<typeof MockSelectedPill>;

const Template: StoryFn<typeof SelectedPill> = (args: SelectedPillProps) => {
  return <MockSelectedPill />;
};

export const primary = Template.bind({});

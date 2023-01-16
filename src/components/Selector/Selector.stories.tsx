import { Meta, StoryFn } from '@storybook/react';
import { Selector, SelectorProps, Option } from 'components/Selector/Selector';

export default {
  title: 'Components/Selector',
  component: Selector,
} as Meta<typeof Selector>;

const Template: StoryFn<typeof Selector<string>> = (
  args: SelectorProps<string>
) => {
  return <Selector {...args} />;
};

const setSelectedValue = (arg: Option<string>) => {
  selectedValue = arg;
};
let selectedValue = undefined;

export const primary = Template.bind({});
primary.args = {
  label: 'label',
  options: [
    { label: 'option1', value: 'option1' },
    { label: 'option2', value: 'option2' },
    { label: 'option3', value: 'option3' },
  ],
  selectedValue,
  setSelectedValue,
};

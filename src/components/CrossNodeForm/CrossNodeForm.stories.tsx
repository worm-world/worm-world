import { StoryFn, Meta } from '@storybook/react';
import CrossNodeForm, { CrossNodeFormProps } from './CrossNodeForm';

export default {
  title: 'Components/CrossNodeForm',
  component: CrossNodeForm,
} as Meta<typeof CrossNodeForm>;

const Template: StoryFn<typeof CrossNodeForm> = (args: CrossNodeFormProps) => {
  return <CrossNodeForm {...args} />;
};

export const primary = Template.bind({});
primary.args = {
  addNewCrossNode: (crossNode: JSX.Element) => {
    alert('Would add new node \n' + JSON.stringify(crossNode.props));
  },
};

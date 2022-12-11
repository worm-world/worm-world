import { StoryFn, Meta } from '@storybook/react';
import CrossNode from 'components/CrossNode/CrossNode';
import * as testData from 'components/CrossNode/CrossNode.data';

export default {
  title: 'Components/Cross Node',
  component: CrossNode,
  argTypes: {
    isSelected: { control: { type: 'boolean' } },
    sex: {
      options: [0, 1, 2],
      control: { type: 'select' }
    },  
  }
} as Meta<typeof CrossNode>;

const Template: StoryFn<typeof CrossNode> = (args) => {
  return <CrossNode {...args}></CrossNode>;
};

export const wildCrossNode = Template.bind({});
wildCrossNode.args = testData.wildCrossNode;

export const Example1 = Template.bind({});
Example1.args = testData.crossNode1;

export const Example2 = Template.bind({});
Example2.args = testData.crossNode2;

export const Example3 = Template.bind({});
Example3.args = testData.crossNode3;


import { StoryFn, Meta } from '@storybook/react';
import CrossNode, { iCrossNodeProps } from 'components/CrossNode/CrossNode';
import * as testData from 'components/CrossNode/CrossNode.data';

export default {
  title: 'Components/Cross Node',
  component: CrossNode,
  argTypes: {
    isSelected: { control: { type: 'boolean' } },
    sex: {
      options: [0, 1, 2],
      control: { type: 'select' },
    },
  },
} as Meta<typeof CrossNode>;

const Template: StoryFn<typeof CrossNode> = (args: iCrossNodeProps) => {
  return <CrossNode {...args}></CrossNode>;
};

export const wildCrossNode = Template.bind({});
wildCrossNode.args = { data: testData.wildCrossNode };

export const Example1 = Template.bind({});
Example1.args = { data: testData.crossNode1 };

export const Example2 = Template.bind({});
Example2.args = { data: testData.crossNode2 };

export const Example3 = Template.bind({});
Example3.args = { data: testData.crossNode3 };

import { StoryFn, Meta } from '@storybook/react';
import CrossNode from 'components/crossNode/CrossNode';
import * as testData from 'components/crossNode/CrossNode.data';

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

export const Primary = Template.bind({});
Primary.args = testData.wildCrossNode;

export const Secondary = Template.bind({});
Secondary.args = testData.crossNode1;

export const Tertiary = Template.bind({});
Tertiary.args = testData.crossNode2;

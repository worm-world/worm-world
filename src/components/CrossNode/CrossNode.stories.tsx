import { StoryFn, Meta } from '@storybook/react';
import CrossNode, { iCrossNodeProps } from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';

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
  return (
    <ReactFlowProvider>
      <CrossNode {...args}></CrossNode>;
    </ReactFlowProvider>
  )
};

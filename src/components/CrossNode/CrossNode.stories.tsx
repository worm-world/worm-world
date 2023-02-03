import { StoryFn, Meta } from '@storybook/react';
import CrossNode, { iCrossNodeProps } from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';
import { CrossNodeModel, iCrossNodeModel } from 'models/frontend/CrossNode/CrossNode';

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
      <CrossNode model={args.model}></CrossNode>
    </ReactFlowProvider>
  );
};

export const empty = Template.bind({});
empty.args = {model: crossNodeMock.empty};

export const wild = Template.bind({});
wild.args = {model: crossNodeMock.wild};

export const smallMutated = Template.bind({});
smallMutated.args = {model: crossNodeMock.smallMutated};

export const mutated = Template.bind({});
mutated.args = {model: crossNodeMock.mutated};

export const badMutationLists = Template.bind({});
badMutationLists.args = {model: crossNodeMock.badMutationLists};

export const badAllele = Template.bind({});
badAllele.args = {model: crossNodeMock.badAllele};

export const monoid = Template.bind({});
monoid.args = {model: crossNodeMock.monoid};

export const diploid = Template.bind({});
diploid.args = {model: crossNodeMock.diploid};

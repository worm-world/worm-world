import { StoryFn, Meta } from '@storybook/react';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';
import {
  CrossNodeFlowWrapper,
  CrossNodeFlowWrapperProps,
} from 'components/FlowWrapper/FlowWrapper';

export default {
  title: 'Components/CrossNodeFlowWrapper',
  component: CrossNodeFlowWrapper,
} as Meta<typeof CrossNodeFlowWrapper>;

const Template: StoryFn<typeof CrossNodeFlowWrapper> = (
  args: CrossNodeFlowWrapperProps
) => {
  return (
    <ReactFlowProvider>
      <CrossNodeFlowWrapper {...args}></CrossNodeFlowWrapper>
    </ReactFlowProvider>
  );
};

export const wrapperOfCrossNode = Template.bind({});
wrapperOfCrossNode.args = {
  data: crossNodeMock.mutated,
};

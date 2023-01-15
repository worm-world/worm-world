import { StoryFn, Meta } from '@storybook/react';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';
import FlowWrapper, {
  FlowWrapperProps,
} from 'components/FlowWrapper/FlowWrapper';
import CrossNode from 'components/CrossNode/CrossNode';
import { XNode } from 'components/XNode/XNode';

export default {
  title: 'Components/FlowWrapper',
  component: FlowWrapper,
} as Meta<typeof FlowWrapper>;

const Template: StoryFn<typeof FlowWrapper> = (args: FlowWrapperProps) => {
  return (
    <ReactFlowProvider>
      <FlowWrapper {...args}></FlowWrapper>
    </ReactFlowProvider>
  );
};

export const wrapperOfCrossNode = Template.bind({});
wrapperOfCrossNode.args = {
  data: <CrossNode model={crossNodeMock.mutated}></CrossNode>,
};

export const wrapperOfXNode = Template.bind({});
wrapperOfXNode.args = {
  data: <XNode />,
};

export const wrapperOfDiv = Template.bind({});
wrapperOfDiv.args = {
  data: <div>This is a div.</div>,
};
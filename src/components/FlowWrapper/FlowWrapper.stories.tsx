import { StoryFn, Meta } from '@storybook/react';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';
import {
  StrainFlowWrapper,
  iStrainFlowWrapper,
} from 'components/FlowWrapper/FlowWrapper';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';

export default {
  title: 'Components/CrossNodeFlowWrapper',
  component: StrainFlowWrapper,
} as Meta<typeof StrainFlowWrapper>;

const Template: StoryFn<typeof StrainFlowWrapper> = (
  args: iStrainFlowWrapper
) => {
  return (
    <ReactFlowProvider>
      <StrainFlowWrapper {...args}></StrainFlowWrapper>
    </ReactFlowProvider>
  );
};

export const wrapperOfCrossNode = Template.bind({});
wrapperOfCrossNode.args = { data: crossNodeMock.mutated };

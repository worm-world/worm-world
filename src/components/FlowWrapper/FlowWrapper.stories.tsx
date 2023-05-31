import { Meta, StoryFn } from '@storybook/react';
import {
  StrainFlowWrapper,
  iStrainFlowWrapper,
} from 'components/FlowWrapper/FlowWrapper';
import * as strainNodeMock from 'models/frontend/StrainNode/StrainNode.mock';
import { ReactFlowProvider } from 'reactflow';

export default {
  title: 'Components/StrainNodeFlowWrapper',
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

export const wrapperOfStrainNode = Template.bind({});
wrapperOfStrainNode.args = { data: strainNodeMock.mutated };

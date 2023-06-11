import { StoryFn, Meta } from '@storybook/react';
import Editor, {
  EditorProps,
} from 'components/Editor/Editor';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';

export default {
  title: 'Components/Editor',
  component: Editor,
} as Meta<typeof Editor>;

const Template: StoryFn<typeof Editor> = (args: EditorProps) => {
  return (
    <BrowserRouter>
      <ReactFlowProvider>
        <Editor {...args}></Editor>;
      </ReactFlowProvider>
    </BrowserRouter>
  );
};

export const primary = Template.bind({});
primary.args = { crossTree: mockCrossTree.simpleCrossTree };

export const secondary = Template.bind({});
secondary.args = { crossTree: mockCrossTree.mediumCrossTree };

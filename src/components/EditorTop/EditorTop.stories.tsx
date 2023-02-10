import { StoryFn, Meta } from '@storybook/react';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export default {
  title: 'Components/EditorTop',
  component: EditorTop,
} as Meta<typeof EditorTop>;

const Template: StoryFn<typeof EditorTop> = (args) => {
  return <EditorTop {...args} />;
};

export const primary = Template.bind({});
primary.args = {
  tree: new CrossTree({
    name: 'My Tree',
    description: '',
    settings: { longName: false, contents: false },
    nodes: [],
    edges: [],
    lastSaved: new Date(),
  }),
  buttons: [
    <button key='only' className='btn mr-8' onClick={() => alert('clicked')}>
      Click Here
    </button>,
  ],
};

export const longTitle = Template.bind({});
longTitle.args = {
  tree: new CrossTree({
    name: 'My Tree Has a Very Long Name that May Not Fit',
    description: '',
    settings: { longName: false, contents: false },
    nodes: [],
    edges: [],
    lastSaved: new Date(),
  }),
  buttons: [
    <button key='only' className='btn mr-8' onClick={() => alert('clicked')}>
      Click Here
    </button>,
  ],
};

export const withoutButton = Template.bind({});
withoutButton.args = {
  tree: new CrossTree({
    name: 'My Tree',
    description: '',
    settings: { longName: false, contents: false },
    nodes: [],
    edges: [],
    lastSaved: new Date(),
  }),
  buttons: [
    <button key='only' className='btn mr-8' onClick={() => alert('clicked')}>
      Click Here
    </button>,
  ],
};

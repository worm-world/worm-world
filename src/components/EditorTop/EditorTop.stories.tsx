import { StoryFn, Meta } from '@storybook/react';
import EditorTop from 'components/EditorTop/EditorTop';

export default {
  title: 'Components/EditorTop',
  component: EditorTop,
  argTypes: {
    name: { control: 'text' },
  },
} as Meta<typeof EditorTop>;

const Template: StoryFn<typeof EditorTop> = (args) => {
  return <EditorTop {...args} />;
};

export const withButton = Template.bind({});
withButton.args = {
  name: 'Title',
  buttons: [
    <button key='only' className='btn mr-8' onClick={() => alert('clicked')}>
      Click Here
    </button>,
  ],
};

export const withoutButton = Template.bind({});
withoutButton.args = {
  name: 'Title',
};

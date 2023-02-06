import { StoryFn, Meta } from '@storybook/react';
import NoteNode, { NoteNodeProps } from 'components/NoteNode/NoteNode';

export default {
  title: 'Components/NoteNode',
  component: NoteNode,
} as Meta<typeof NoteNode>;

const Template: StoryFn<typeof NoteNode> = (args: NoteNodeProps) => {
  return <NoteNode {...args} />;
};

export const empty = Template.bind({});
empty.args = { content: '' };

export const withContent = Template.bind({});
withContent.args = { content: 'This is some content.' };

export const withScroller = Template.bind({});
withScroller.args = {
  content:
    'Lorem ipsum dolor sit amet, \
    consectetur adipiscing elit, sed do eiusmod tempor \
    incididunt ut labore et dolore magna aliqua. \
    Ut enim ad minim veniam, quis nostrud exercitation \
    ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

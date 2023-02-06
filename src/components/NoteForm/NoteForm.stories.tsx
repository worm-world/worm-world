import { StoryFn, Meta } from '@storybook/react';
import NoteForm, { NoteFormProps } from 'components/NoteForm/NoteForm';

export default {
  title: 'Components/NoteForm',
  component: NoteForm,
} as Meta<typeof NoteForm>;

const Template: StoryFn<typeof NoteForm> = (args: NoteFormProps) => {
  return <NoteForm {...args} />;
};

export const primary = Template.bind({});
primary.args = {
  callback: () => {
    alert('clicked');
  },
};

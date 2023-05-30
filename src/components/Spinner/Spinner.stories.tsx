import { StoryFn, Meta } from '@storybook/react';
import Spinner from 'components/Spinner/Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>;

const Template: StoryFn<typeof Spinner> = () => {
  return <Spinner/>;
};

export const Primary = Template.bind({});

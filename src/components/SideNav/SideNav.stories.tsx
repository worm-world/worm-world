import { StoryFn, Meta } from '@storybook/react';
import SideNav from 'components/SideNav/SideNav';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/SideNav',
  component: SideNav,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof SideNav>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof SideNav> = ({
  isOpen = true,
  drawerWidth = 240,
}) => <SideNav isOpen={isOpen} drawerWidth={drawerWidth} />;

export const OpenSideNav = Template.bind({});

export const ClosedSideNav = Template.bind({});
ClosedSideNav.args = {
  isOpen: false,
};
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const WideSideNav = Template.bind({});
WideSideNav.args = {
  drawerWidth: 800,
};
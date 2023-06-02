import { StoryFn, Meta } from '@storybook/react';
import { BiBaseball, BiBody, BiChair } from 'react-icons/bi';
import { Menu, MenuProps } from 'components/Menu/Menu';
import { BsLightningCharge as MenuIcon } from 'react-icons/bs';

export default {
  title: 'Components/Menu',
  component: Menu,
} as Meta<typeof Menu>;

const Template: StoryFn<typeof Menu> = (args: MenuProps) => {
  return <Menu {...args}></Menu>;
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Menu',
  icon: <MenuIcon />,
  items: [
    {
      icon: <BiBaseball />,
      text: 'Option 1',
      menuCallback: () => alert('clicked option 1'),
    },
    {
      icon: <BiBody />,
      text: 'Option 2',
      menuCallback: () => alert('clicked option 2'),
    },
    {
      icon: <BiChair />,
      text: 'Option 3',
      menuCallback: () => alert('clicked option 3'),
    },
  ],
};

export const NoIcons = Template.bind({});
NoIcons.args = {
  items: [
    {
      text: 'Option 1',
      menuCallback: () => alert('clicked option 1'),
    },
    {
      text: 'Option 2',
      menuCallback: () => alert('clicked option 2'),
    },
    {
      text: 'Option 3',
      menuCallback: () => alert('clicked option 3'),
    },
  ],
};

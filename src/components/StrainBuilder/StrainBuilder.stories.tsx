import { StoryFn, Meta } from '@storybook/react';
import StrainBuilder, {
  StrainBuilderProps,
} from 'components/StrainBuilder/StrainBuilder';

export default {
  title: 'Components/StrainBuilder',
  component: StrainBuilder,
} as Meta<typeof StrainBuilder>;

const Template: StoryFn<typeof StrainBuilder> = (props: StrainBuilderProps) => {
  return <StrainBuilder {...props} />;
};

export const Primary = Template.bind({});
Primary.args = {};

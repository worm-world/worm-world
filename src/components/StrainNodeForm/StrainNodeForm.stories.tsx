import { Meta, StoryFn } from '@storybook/react';
import StrainNodeForm, {
  StrainNodeFormProps,
} from 'components/StrainNodeForm/StrainNodeForm';

export default {
  title: 'Components/StrainNodeForm',
  component: StrainNodeForm,
} as Meta<typeof StrainNodeForm>;

const Template: StoryFn<typeof StrainNodeForm> = (
  args: StrainNodeFormProps
) => {
  return (
    <div className='flex justify-between'>
      <div>
        <StrainNodeForm
          onSubmit={() => {
            alert('clicked submit');
          }}
        />
      </div>
    </div>
  );
};

export const primary = Template.bind({});

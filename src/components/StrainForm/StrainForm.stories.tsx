import { Meta, StoryFn } from '@storybook/react';
import StrainForm, { StrainFormProps } from 'components/StrainForm/StrainForm';

export default {
  title: 'Components/StrainForm',
  component: StrainForm,
} as Meta<typeof StrainForm>;

const Template: StoryFn<typeof StrainForm> = (args: StrainFormProps) => {
  return (
    <div className='flex justify-between'>
      <div>
        <StrainForm
          onSubmit={() => {
            alert('clicked submit');
          }}
        />
      </div>
    </div>
  );
};

export const primary = Template.bind({});

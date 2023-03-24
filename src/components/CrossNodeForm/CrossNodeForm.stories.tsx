import { StoryFn, Meta } from '@storybook/react';
import CrossNodeForm, { CrossNodeFormProps } from './CrossNodeForm';

export default {
  title: 'Components/CrossNodeForm',
  component: CrossNodeForm,
} as Meta<typeof CrossNodeForm>;

const Template: StoryFn<typeof CrossNodeForm> = (args: CrossNodeFormProps) => {
  return (
    <div className='flex justify-between'>
      <div>
        <CrossNodeForm
          onSubmitCallback={() => {
            alert('clicked submit');
          }}
        />
      </div>
    </div>
  );
};

export const primary = Template.bind({});

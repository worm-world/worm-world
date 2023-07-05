import { StoryFn, Meta } from '@storybook/react';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import { useState } from 'react';

const MockEditableDiv = (): React.JSX.Element => {
  const [value, setValue] = useState('text content');
  const [valueEditable, setValueEditable] = useState(false);
  const onClick = () => {
    setValueEditable(true);
  };
  const onFinishEditing = () => {
    setValueEditable(false);
  };

  return (
    <EditableDiv
      value={value}
      setValue={setValue}
      editable={valueEditable}
      onFinishEditing={onFinishEditing}
      onClick={onClick}
    />
  );
};

export default {
  title: 'Components/EditableDiv',
  component: MockEditableDiv,
} as Meta<typeof MockEditableDiv>;

const Template: StoryFn<typeof MockEditableDiv> = () => {
  return <MockEditableDiv />;
};

export const editableOnClick = Template.bind({});
editableOnClick.args = { value: 'Some text content' };

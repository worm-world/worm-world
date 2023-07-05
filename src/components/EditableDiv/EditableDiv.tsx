import {
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from 'react';

interface EditableDivProps {
  value: string;
  setValue: (newValue: string) => void;
  editable: boolean;
  onFinishEditing: () => void;
  onClick?: MouseEventHandler;
  placeholder?: string;
  autoFocus?: boolean;
}

const EditableDiv = (props: EditableDivProps): React.JSX.Element => {
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      props.onFinishEditing();
    }
  };
  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    props.onFinishEditing();
  };
  return (
    <div data-testid='editableDiv'>
      {props.editable ? (
        <input
          className='input-ghost w-full border-2 border-base-300 bg-transparent'
          onClick={(e) => {
            e.preventDefault();
          }}
          type='text'
          value={props.value}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          className={`w-full truncate border-2 border-transparent ${
            props.onClick !== undefined
              ? 'hover:cursor-text hover:border-base-300'
              : ''
          }`}
          onClick={props.onClick}
        >
          {props.value !== '' ? props.value : props.placeholder}
        </div>
      )}
    </div>
  );
};

export default EditableDiv;

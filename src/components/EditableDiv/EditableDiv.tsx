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
    <div className='h-full w-full' data-testid='editableDiv'>
      {props.editable ? (
        <input
          className='input-ghost w-full border-2 border-base-300 bg-transparent p-1'
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
          className={`h-full w-full truncate border-2 border-transparent p-1 ${
            props.onClick !== undefined
              ? 'hover:cursor-text hover:border-base-300'
              : ''
          }`}
          onClick={props.onClick}
        />
      )}
    </div>
  );
};

export default EditableDiv;

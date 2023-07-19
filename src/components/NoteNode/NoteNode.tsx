export interface NoteNodeProps {
  id: string;
  data: string;
}

export const NoteNode = (props: NoteNodeProps): React.JSX.Element => {
  // TODO useContext here
  return (
    <div
      data-testid='noteNode'
      // onDoubleClick={props.onDoubleClick}
      className='max-h-28 max-w-xs overflow-auto rounded-md border-2 border-base-300 bg-base-100 p-2 shadow-md hover:cursor-grab'
    >
      {props.data}
    </div>
  );
};

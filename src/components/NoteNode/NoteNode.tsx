import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';

export const NoteNode = (props: NoteNodeProps): JSX.Element => {
  return (
    <div
      data-testid='noteNode'
      onDoubleClick={props.onDoubleClick}
      className='max-h-28 max-w-xs overflow-auto rounded-md border-2 border-info bg-base-100 p-2 shadow-md hover:cursor-grab'
    >
      {props.content}
    </div>
  );
};

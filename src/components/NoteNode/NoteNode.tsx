export interface NoteNodeProps {
  content: string;
  onDoubleClick: () => void;
}

export const NoteNode = (props: NoteNodeProps): JSX.Element => {
  return (
    <div
      data-testid='noteNode'
      onDoubleClick={props.onDoubleClick}
      className='max-h-28 max-w-xs overflow-hidden overflow-y-scroll rounded-md border-2 border-info bg-base-100 p-2 shadow-md hover:cursor-grab'
    >
      {props.content}
    </div>
  );
};

export default NoteNode;

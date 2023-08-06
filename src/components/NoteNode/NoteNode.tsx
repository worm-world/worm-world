import EditorContext from 'components/EditorContext/EditorContext';
import { useContext } from 'react';

export interface NoteNodeProps {
  id: string;
  data: string;
}

export const NoteNode = (props: NoteNodeProps): React.JSX.Element => {
  const context = useContext(EditorContext);
  return (
    <div
      data-testid='noteNode'
      onDoubleClick={() => {
        context.openNote(props.id);
      }}
      className='max-h-28 max-w-xs overflow-auto rounded-md border-2 border-base-300 bg-base-100 p-2 shadow-md hover:cursor-pointer'
    >
      {props.data}
    </div>
  );
};

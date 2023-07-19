import { BiX as CloseIcon } from 'react-icons/bi';
import { Handle, Position } from 'reactflow';

export const XNode = (props: { id: string }): React.JSX.Element => {
  console.log('xNode id', props.id);
  return (
    <div className='h-fit w-fit'>
      <Handle key='left' id='left' type='target' position={Position.Left} />
      <Handle key='right' id='right' type='target' position={Position.Right} />
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <label key={props.id} htmlFor={`cross-filter-modal-${props.id}`}>
        <div className='h-16 w-16 rounded-full bg-primary p-4 shadow transition hover:cursor-pointer hover:bg-primary-focus'>
          <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
        </div>
      </label>
    </div>
  );
};

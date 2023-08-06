import {
  HiFilter as FilterIcon,
  HiOutlineFilter as OutlineFilterIcon,
} from 'react-icons/hi';
import { AiOutlineEyeInvisible as EyeIcon } from 'react-icons/ai';
import type StrainFilter from 'models/frontend/StrainFilter/StrainFilter';
import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';
import { Handle, Position } from 'reactflow';
import { NodeType } from 'components/Editor/Editor';
import { BiX as CloseIcon } from 'react-icons/bi';

interface MiddleNodeProps {
  id: string;
  data: StrainFilter;
  type: string;
}

export const MIDDLE_NODE_WIDTH = 64; // w-16
export const MIDDLE_NODE_HEIGHT = 64; // w-16

const MiddleNode = (props: MiddleNodeProps): React.JSX.Element => {
  return (
    <div className='group'>
      {props.type === NodeType.Self ? (
        <Handle key='top' id='top' type='target' position={Position.Top} />
      ) : (
        <>
          <Handle key='left' id='left' type='target' position={Position.Left} />
          <Handle
            key='right'
            id='right'
            type='target'
            position={Position.Right}
          />
        </>
      )}
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <label
        htmlFor={`filtered-out-modal-${props.id}`}
        className={`absolute -top-4 left-24 hover:cursor-pointer ${
          props.data.isEmpty() ? 'invisible' : ''
        }`}
      >
        <EyeIcon size='30' />
      </label>
      <label
        htmlFor={`strain-filter-modal-${props.id}`}
        className={`absolute -top-4 left-16 hover:cursor-pointer ${
          props.data.isEmpty() ? 'invisible group-hover:visible' : ''
        }`}
      >
        {props.data.isEmpty() ? (
          <OutlineFilterIcon size='30' />
        ) : (
          <FilterIcon size='30' />
        )}
      </label>

      <div
        className={`h-16 w-16 rounded-full p-4 shadow transition hover:cursor-grab ${
          props.type === NodeType.Self ? 'bg-secondary' : 'bg-primary'
        }`}
      >
        {props.type === NodeType.Self ? (
          <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
        ) : (
          <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
        )}
      </div>
    </div>
  );
};

export default MiddleNode;

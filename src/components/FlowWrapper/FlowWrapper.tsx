import CrossNode from 'components/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Handle, Position } from 'reactflow';
import { XNode } from 'components/XNode/XNode';
import { SelfNode } from 'components/SelfNode/SelfNode';
import { NoteNode } from 'components/NoteNode/NoteNode';
import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';

export interface iStrainFlowWrapper {
  data: CrossNodeModel;
}

export const StrainFlowWrapper = (props: iStrainFlowWrapper): JSX.Element => {
  const isMale = props.data.sex === Sex.Male;

  const rStyling = isMale ? '' : 'invisible';
  const bStyling = isMale ? 'invisible' : '';
  const lStyling = isMale ? 'invisible' : '';

  return (
    <div className='h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='right'
        className={rStyling}
        id='right'
        type='source'
        position={Position.Right}
      />
      <Handle
        key='left'
        className={lStyling}
        id='left'
        type='source'
        position={Position.Left}
      />
      <Handle
        key='bottom'
        className={bStyling}
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <CrossNode model={props.data} />
    </div>
  );
};

// Container used to wrap components for use in React Flow
export const XIconFlowWrapper = (): JSX.Element => {
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
      <XNode />
    </div>
  );
};

export const SelfIconFlowWrapper = (): JSX.Element => {
  return (
    <div className='h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <SelfNode />
    </div>
  );
};

export const NoteFlowWrapper = (props: {
  data: NoteNodeProps;
}): JSX.Element => {
  return <NoteNode {...props.data}></NoteNode>;
};

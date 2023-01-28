import CrossNode from 'components/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Handle, Position } from 'reactflow';
import { XNode } from 'components/XNode/XNode';
import { SelfNode } from 'components/SelfNode/SelfNode';

export interface CrossNodeFlowWrapperProps {
  data: CrossNodeModel;
}

export const CrossNodeFlowWrapper = (
  props: CrossNodeFlowWrapperProps
): JSX.Element => {
  const handleElements = [
    <Handle key='top' id='top' type='target' position={Position.Top} />,
  ];

  if (props.data.sex === Sex.Male) {
    handleElements.push(
      <Handle key='right' id='right' type='source' position={Position.Right} />
    );
  } else {
    handleElements.push(
      <Handle key='left' id='left' type='source' position={Position.Left} />,
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
    );
  }

  return (
    <div className='h-fit w-fit'>
      {handleElements}
      <CrossNode {...props.data} />
    </div>
  );
};

// Container used to wrap components for use in React Flow
export const XNodeFlowWrapper = (): JSX.Element => {
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

export const SelfNodeFlowWrapper = (): JSX.Element => {
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

import CrossNode from 'components/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Handle, Position } from 'reactflow';
import { XNode, XNodeProps } from 'components/XNode/XNode';
import { SelfIconProps, SelfNode } from 'components/SelfNode/SelfNode';
import { NoteNode } from 'components/NoteNode/NoteNode';
import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';
import FilteredOutNode, {
  FilteredOutNodeProps,
} from 'components/FilteredOutNode/FilteredOutNode';

export interface iStrainFlowWrapper {
  data: CrossNodeModel;
}

export const StrainFlowWrapper = (props: iStrainFlowWrapper): JSX.Element => {
  const isMale = props.data.sex === Sex.Male;

  const rStyling = isMale ? '' : 'invisible';
  const bStyling = isMale ? 'invisible' : '';
  const lStyling = isMale ? 'invisible' : '';

  return (
    <div className='strain-node h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />

      <div className={rStyling}>
        <Handle
          key='right'
          id='right'
          type='source'
          position={Position.Right}
        />
      </div>
      <div className={lStyling}>
        <Handle
          key='left'
          className={lStyling}
          id='left'
          type='source'
          position={Position.Left}
        />
      </div>
      <div className={bStyling}>
        <Handle
          key='bottom'
          className={bStyling}
          id='bottom'
          type='source'
          position={Position.Bottom}
        />
      </div>
      <CrossNode model={props.data} />
    </div>
  );
};

// Container used to wrap components for use in React Flow
export const XIconFlowWrapper = (props: { data: XNodeProps }): JSX.Element => {
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
      <XNode {...props.data} />
    </div>
  );
};

export const SelfIconFlowWrapper = (props: {
  data: SelfIconProps;
}): JSX.Element => {
  return (
    <div className='h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <SelfNode {...props.data} />
    </div>
  );
};

export const NoteFlowWrapper = (props: {
  data: NoteNodeProps;
}): JSX.Element => {
  return <NoteNode {...props.data}></NoteNode>;
};

export const FilteredOutFlowWrapper = (props: {
  data: FilteredOutNodeProps;
}): JSX.Element => {
  return (
    <div>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <FilteredOutNode {...props.data} />
    </div>
  );
};

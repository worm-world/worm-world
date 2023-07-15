import StrainNode from 'components/StrainNode/StrainNode';
import { Sex } from 'models/enums';
import { type StrainData } from 'models/frontend/StrainData/StrainData';
import { Handle, Position } from 'reactflow';
import { XNode, type XNodeProps } from 'components/XNode/XNode';
import { type SelfIconProps, SelfNode } from 'components/SelfNode/SelfNode';
import { NoteNode } from 'components/NoteNode/NoteNode';
import { type NoteNodeProps } from 'components/NoteNode/NoteNodeProps';
import FilteredOutNode, {
  type FilteredOutNodeProps,
} from 'components/FilteredOutNode/FilteredOutNode';

export interface StrainFlowWrapperProps {
  data: StrainData;
}

export const StrainFlowWrapper = (
  props: StrainFlowWrapperProps
): React.JSX.Element => {
  const isMale = props.data.strain.sex === Sex.Male;

  const rStyling = isMale ? '' : 'invisible';
  const bStyling = isMale ? 'invisible' : '';
  const lStyling = isMale ? 'invisible' : '';

  return (
    <div className='strain-node h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='right'
        id='right'
        className={rStyling}
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
      <StrainNode data={props.data} />
    </div>
  );
};

// Container used to wrap components for use in React Flow
export const XIconFlowWrapper = (props: {
  data: XNodeProps;
}): React.JSX.Element => {
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
}): React.JSX.Element => {
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
}): React.JSX.Element => {
  return <NoteNode {...props.data}></NoteNode>;
};

export const FilteredOutFlowWrapper = (props: {
  data: FilteredOutNodeProps;
}): React.JSX.Element => {
  return (
    <div>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <FilteredOutNode {...props.data} />
    </div>
  );
};

import StrainCard from 'components/StrainCard/StrainCard';
import { Sex } from 'models/enums';
import { type Strain } from 'models/frontend/Strain/Strain';
import { Handle, Position } from 'reactflow';

export const STRAIN_NODE_WIDTH = 256; // w-64
export const STRAIN_NODE_HEIGHT = 144; // w-36

export interface StrainNodeProps {
  data: Strain;
  id: string;
  xPos: number;
  yPos: number;
}

const StrainNode = (props: StrainNodeProps): React.JSX.Element => {
  const isMale = props.data.sex === Sex.Male;
  const rStyling = isMale ? '' : 'invisible';
  const bLStyling = isMale ? 'invisible' : '';

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
        className={bLStyling}
        id='left'
        type='source'
        position={Position.Left}
      />
      <Handle
        key='bottom'
        className={bLStyling}
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <div className='text-sm'>{props.id}</div>
      <div className='text-sm'>
        {Math.round(props.xPos)},{Math.round(props.yPos)}
      </div>
      <StrainCard {...props} />
    </div>
  );
};

export default StrainNode;

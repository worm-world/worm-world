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
  const isHerm = props.data.sex === Sex.Hermaphrodite;
  const bRStyling = isHerm ? '' : 'invisible';
  const lStyling = isHerm ? 'invisible' : '';

  return (
    <div className='strain-node h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='right'
        id='right'
        className={bRStyling}
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
        className={bRStyling}
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <StrainCard strain={props.data} {...props} />
    </div>
  );
};

export default StrainNode;

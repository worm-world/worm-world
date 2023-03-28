import CrossNode from 'components/CrossNode/CrossNode';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Node } from 'reactflow';

interface FilteredOutModalProps {
  nodeId: string;
  excludedNodes: Array<Node<CrossNodeModel>>;
}

const FilteredOutModal = (props: FilteredOutModalProps): JSX.Element => {
  return (
    <>
      <input
        type='checkbox'
        id={`filtered-out-modal-${props.nodeId}`}
        className='modal-toggle'
      />
      <label
        htmlFor={`filtered-out-modal-${props.nodeId}`}
        className='modal cursor-pointer'
      >
        <label className='modal-box bg-base-300'>
          <label className='text-lg'>
            <span className='font-bold'>{props.excludedNodes.length}</span>{' '}
            strain
            {props.excludedNodes.length > 1 ? 's are' : ' is'} not shown:
          </label>
          <ul>
            {props.excludedNodes.map((node, idx) => (
              <li key={idx} className='p-4'>
                <CrossNode disableMenu={true} model={node.data} />
              </li>
            ))}
          </ul>
        </label>
      </label>
    </>
  );
};

export default FilteredOutModal;

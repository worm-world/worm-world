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
        <label className='modal-box w-auto'>
          <div className='rounded-box border border-base-300 bg-base-200 shadow-md'>
            <div className='mt-8 text-center text-2xl font-medium'>
              {`${props.excludedNodes.length} strain`}
              {props.excludedNodes.length > 1 ? 's are' : ' is'} not shown:
            </div>
            <div className='divider w-auto px-8' />
            <ul>
              {props.excludedNodes.map((node, idx) => {
                const copiedData = new CrossNodeModel(node.data);
                copiedData.toggleHetPair = undefined;
                copiedData.toggleSex = undefined;
                copiedData.getMenuItems = () => [];

                return (
                  <li
                    key={idx}
                    className='flex flex-row items-center py-4 pl-8 pr-16'
                  >
                    <div className='text-content mr-8 brightness-95'>{`${
                      idx + 1
                    }.`}</div>
                    <div>
                      <CrossNode model={copiedData} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </label>
      </label>
    </>
  );
};

export default FilteredOutModal;

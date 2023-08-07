import StrainCard from 'components/StrainCard/StrainCard';
import { type Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';

interface FilteredOutModalProps {
  filterId: string;
  excludedNodes: Array<Node<Strain>>;
}

const FilteredOutModal = (props: FilteredOutModalProps): React.JSX.Element => {
  return (
    <>
      <input
        type='checkbox'
        id={`filtered-out-modal-${props.filterId}`}
        className='modal-toggle'
      />
      <label
        htmlFor={`filtered-out-modal-${props.filterId}`}
        className='modal cursor-pointer'
      >
        <label className='modal-box w-auto'>
          <div className='rounded-box border border-base-300 bg-base-200 shadow-md'>
            <div className='mt-8 text-center text-2xl font-medium'>
              {`${props.excludedNodes.length} Strain`}
              {props.excludedNodes.length > 1 ? 's' : ''} Hidden
            </div>
            <div className='divider w-auto px-8' />
            <ul>
              {props.excludedNodes.map((node, idx) => {
                return (
                  <li
                    key={idx}
                    className='flex flex-row items-center py-4 pl-8 pr-16'
                  >
                    <div className='text-content mr-8 brightness-95'>{`${
                      idx + 1
                    }.`}</div>
                    <div>
                      <StrainCard strain={node.data} id={node.id} />
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

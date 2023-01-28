import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export interface SavedTreeCardProps {
  tree: CrossTree;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  return (
    <div className='flex'>
      <Link
        to={'/tree-view'}
        className='card-compact card h-52 w-52 overflow-hidden rounded-lg shadow-xl'
        state={{ treeId: props.tree.id.toString() }}
      >
        <div className='h-full bg-primary'>
          <div className='flex justify-end'>
            <button className='flex h-8 w-8 place-content-center rounded-full bg-primary hover:bg-primary-focus'>
              <MoreHorizIcon className='m-auto' />
            </button>
          </div>
        </div>
        <div className='card-body h-full bg-base-200'>
          <div className='card-title'>{props.tree.name}</div>
          <div>{props.tree.description}</div>
        </div>
      </Link>
    </div>
  );
};

export default SavedTreeCard;

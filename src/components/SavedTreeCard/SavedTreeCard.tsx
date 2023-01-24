import { MouseEvent, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export interface SavedTreeCardProps {
  tree: CrossTree;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='flex'>
      <Link
        to={'tree-view/'}
        className='card card-compact h-52 w-52 overflow-hidden rounded-lg shadow-xl'
        state={{ treeId: props.tree.id.toString() }}
      >
        <div className='h-full bg-primary'>
          <div className='flex justify-end'>
            <button
              onClick={(event: MouseEvent) => {
                event.preventDefault();
                setShowMenu(true);
              }}
              className='flex h-8 w-8 place-content-center rounded-full bg-primary hover:bg-primary-focus'
            >
              <MoreHorizIcon className='m-auto' />
            </button>
          </div>
        </div>
        <div className='card-body h-full bg-base-200'>
          <div className='card-title'>{props.tree.name}</div>
          <div>{props.tree.description}</div>
        </div>
      </Link>
      {showMenu && (
        <ClickAwayListener onClickAway={() => setShowMenu(false)}>
          <div className='relative'>
            <ul className='menu menu-compact absolute top-0 z-10 ml-1 h-min rounded-lg border-2 bg-base-100'>
              <li>
                <Link
                  to={'tree-view/'}
                  state={{ treeId: props.tree.id.toString() }}
                >
                  Open
                </Link>
              </li>
              <li className='text-red-500'>
                <a onClick={() => alert('would delete')}>Delete</a>
              </li>
            </ul>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default SavedTreeCard;

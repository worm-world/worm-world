import { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

export interface SavedTreeCardProps {
  treeId: number;
  name: string;
  description: string;
  lastSaved: Date;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Link
      to={'treeView/'}
      state={{ tree: mockCrossTree.ed3CrossTree }}
      className='flex'
    >
      <div className='group flex h-52 w-52 flex-col overflow-hidden rounded-lg border-base-200 shadow-xl hover:cursor-pointer hover:border-base-300'>
        <div className='flex h-full w-full content-start justify-end bg-primary'>
          <button
            onClick={() => setShowMenu(true)}
            className='flex h-8 w-8 place-content-center rounded-full bg-primary hover:bg-primary-focus '
          >
            <MoreHorizIcon className='m-auto' />
          </button>
        </div>
        <footer className='bg-base-200 group-hover:bg-base-300'>
          <div className='text-center text-xl'>{props.name}</div>
          <div className='border-t-1 border-base-300 p-2'>
            {props.description}
          </div>
        </footer>
      </div>
      {showMenu && (
        <ClickAwayListener onClickAway={() => setShowMenu(false)}>
          <ul className='ml-3 h-min overflow-hidden rounded-lg border-2 border-base-200 shadow-xl'>
            <li className='hover:bg-base-300'>Open in Editor</li>
            <li className='text-red-500 hover:bg-base-300'>Delete</li>
          </ul>
        </ClickAwayListener>
      )}
    </Link>
  );
};

export default SavedTreeCard;

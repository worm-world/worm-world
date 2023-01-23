import { MouseEvent, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link, useOutletContext } from 'react-router-dom';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export interface SavedTreeCardProps {
  tree: CrossTree;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const [, setCurrentTree]: [CrossTree, (tree: CrossTree) => void] =
    useOutletContext();

  return (
    <div className='flex'>
      <Link
        onClick={() => setCurrentTree(props.tree)}
        to={'treeView/'}
        className='flex h-52 w-52'
      >
        <div className='group flex flex-col overflow-hidden rounded-lg border-base-200 shadow-xl hover:cursor-pointer'>
          <div className='flex h-full w-full content-start justify-end bg-primary'>
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
          <footer className='bg-base-200'>
            <div className='text-center text-xl'>{props.tree.name}</div>
            <div className='border-t-1 border-base-300 p-2'>
              {props.tree.description}
            </div>
          </footer>
        </div>
      </Link>
      {showMenu && (
        <ClickAwayListener onClickAway={() => setShowMenu(false)}>
          <div className='relative'>
            <ul className='border-gray menu menu-compact absolute top-0 ml-1 h-min rounded-lg border-2 bg-base-100'>
              <li>
                <Link to={'treeView/'}>Open</Link>
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

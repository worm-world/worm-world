import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { Menu, MenuItem } from 'components/Menu/Menu';
import { useState } from 'react';
import { deleteTree, insertTree } from 'api/crossTree';

export interface SavedTreeCardProps {
  tree: CrossTree;
  refreshTrees: () => void;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className='relative left-40 h-0'>
          <Menu
            items={getMenuItems(
              props.tree,
              navigate,
              props.refreshTrees,
              setDeleteModalOpen
            )}
            title='Actions'
            icon={<MoreHorizIcon />}
          />
        </div>
        <Link
          to={'/tree-view'}
          className='card h-52 w-52 rounded-lg shadow-xl'
          state={{ treeId: props.tree.id.toString() }}
        >
          <div className='flex h-1/2 justify-end rounded-t-lg bg-primary' />
          <div className='h-1/2 bg-base-200 p-4 pt-2'>
            <div className='card-title w-full truncate'>
              {props.tree.name !== '' ? props.tree.name : '(Untitled)'}
            </div>
            <div className='h-8 min-h-[1.25rem]'>{props.tree.description}</div>
            <div className='flex h-8 w-full justify-between'>
              <span>Last saved:</span>
              <span>{props.tree.lastSaved.toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      </div>

      <div
        className={`modal cursor-pointer ${
          deleteModalOpen ? 'modal-open' : ''
        }`}
        onClick={() => setDeleteModalOpen(false)}
      >
        <div className='modal-box relative cursor-auto'>
          <h1 className='text-lg font-bold'>
            Are you sure you want to delete &quot;
            {props.tree.name !== '' ? props.tree.name : '(Untitled)'}&quot;?
          </h1>
          <div className='modal-action flex justify-center'>
            <button
              className='btn-error btn'
              onClick={() => {
                deleteTree(props.tree.id)
                  .then(props.refreshTrees)
                  .catch((error) => console.error(error));
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                setDeleteModalOpen(false);
              }}
              className='btn'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const getMenuItems = (
  tree: CrossTree,
  navigate: NavigateFunction,
  refreshTrees: () => void,
  setDeleteModalOpen: (open: boolean) => void
): MenuItem[] => {
  return [
    {
      text: 'Open',
      menuCallback: () => {
        navigate('/tree-view', { state: { treeId: tree.id.toString() } });
      },
    },
    {
      text: 'Copy',
      menuCallback: () => {
        copyTree(tree)
          .then(refreshTrees)
          .catch((error) => console.error(error));
      },
    },
    {
      text: 'Delete',
      menuCallback: () => {
        setDeleteModalOpen(true);
      },
    },
  ];
};

const copyTree = async (tree: CrossTree): Promise<void> => {
  const newTree = tree.clone();
  newTree.name = `Copy of ${tree.name}`;
  newTree.lastSaved = new Date();
  await insertTree(newTree.generateRecord(true));
};

export default SavedTreeCard;

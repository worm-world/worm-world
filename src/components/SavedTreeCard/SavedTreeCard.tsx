import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { Menu, MenuItem } from 'components/Menu/Menu';
import { useEffect, useState } from 'react';
import { deleteTree, insertTree, updateTree } from 'api/crossTree';
import { open } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { sep } from '@tauri-apps/api/path';
import { toast } from 'react-toastify';
import EditableDiv from 'components/EditableDiv/EditableDiv';

export interface SavedTreeCardProps {
  tree: CrossTree;
  refreshTrees: () => void;
}

const SavedTreeCard = (props: SavedTreeCardProps): JSX.Element => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nameEditable, setNameEditable] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    setName(props.tree.name);
  }, [props.tree.name]);

  const getMenuItems = (): MenuItem[] => {
    return [
      {
        text: 'Open',
        menuCallback: () => {
          navigate('/tree-view', {
            state: { treeId: props.tree.id.toString() },
          });
        },
      },
      {
        text: 'Rename',
        menuCallback: () => {
          setNameEditable(true);
        },
      },
      {
        text: 'Export',
        menuCallback: () => {
          exportTree(props.tree).catch((err) => console.error(err));
        },
      },
      {
        text: 'Copy',
        menuCallback: () => {
          copyTree(props.tree)
            .then(props.refreshTrees)
            .catch((err) => console.error(err));
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

  const updateTreeName = (): void => {
    props.tree.name = name;
    props.tree.lastSaved = new Date();
    updateTree(props.tree.generateRecord(props.tree.editable))
      .then(props.refreshTrees)
      .catch((error) => console.error(error));
    setNameEditable(false);
  };

  return (
    <>
      <div className='m-4'>
        <div className='relative left-40 z-10 h-0'>
          <Menu
            items={getMenuItems()}
            title='Actions'
            icon={<MoreHorizIcon />}
          />
        </div>
        <Link
          to={'/tree-view'}
          className='card hover h-52 w-52 rounded-lg shadow-xl hover:brightness-[.97]'
          state={{ treeId: props.tree.id.toString() }}
        >
          <div className='flex h-1/2 justify-end rounded-t-lg bg-primary' />
          <div className='h-1/2 bg-base-200 p-4 pt-2 text-base-content'>
            <div className='card-title w-full truncate'>
              <EditableDiv
                value={name}
                setValue={setName}
                editable={nameEditable}
                onFinishEditing={updateTreeName}
                placeholder='(Untitled)'
              />
            </div>
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

const copyTree = async (tree: CrossTree): Promise<void> => {
  const newTree = tree.clone();
  newTree.name = `Copy of ${tree.name}`;
  newTree.lastSaved = new Date();
  newTree.editable = true;
  await insertTree(newTree.generateRecord(newTree.editable));
};

const exportTree = async (tree: CrossTree): Promise<void> => {
  try {
    const dir: string | null = (await open({
      directory: true,
    })) as string | null;
    if (dir === null) return;
    const filename = tree.name !== '' ? tree.name : 'untitled';
    await writeTextFile(`${dir}${sep}${filename}.ww.json`, tree.toJSON());
    toast.success('Successfully exported tree');
  } catch (err) {
    toast.error(`Error exporting tree: ${err}`);
  }
};

export default SavedTreeCard;

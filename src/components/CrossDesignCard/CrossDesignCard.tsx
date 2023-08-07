import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { Menu } from 'components/Menu/Menu';
import { useEffect, useState } from 'react';
import {
  deleteCrossDesign,
  insertCrossDesign,
  updateCrossDesign,
} from 'api/crossDesign';
import { open } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { sep } from '@tauri-apps/api/path';
import { toast } from 'react-toastify';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import { ulid } from 'ulid';

export interface CrossDesignCardProps {
  crossDesign: CrossDesign;
  refreshCrossDesigns: () => void;
  isNew: boolean;
}

const CrossDesignCard = (props: CrossDesignCardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nameEditable, setNameEditable] = useState(props.isNew);
  const [name, setName] = useState('');

  useEffect(() => {
    setName(props.crossDesign.name);
  }, [props.crossDesign.name]);

  const menuItems = [
    {
      text: 'Open',
      menuCallback: () => {
        navigate('/editor', {
          state: { crossDesignId: props.crossDesign.id.toString() },
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
        exportCrossDesign(props.crossDesign).catch(console.error);
      },
    },
    {
      text: 'Copy',
      menuCallback: () => {
        copyCrossDesign(props.crossDesign)
          .then(props.refreshCrossDesigns)
          .catch((err) => {
            console.error(err);
          });
      },
    },
    {
      text: 'Delete',
      menuCallback: () => {
        setDeleteModalOpen(true);
      },
    },
  ];

  const updateCrossDesignName = (): void => {
    props.crossDesign.name = name.trim();
    props.crossDesign.lastSaved = new Date();
    updateCrossDesign(props.crossDesign.generateRecord())
      .then(props.refreshCrossDesigns)
      .catch(console.error);
    setNameEditable(false);
  };

  return (
    <div className='m-4'>
      <Link
        to={'/editor'}
        className='card h-52 w-52 rounded-lg shadow-xl'
        state={{ crossDesignId: props.crossDesign.id.toString() }}
      >
        <div className='flex h-1/2 justify-end rounded-t-lg bg-primary'>
          <Menu items={menuItems} title='Actions' icon={<MoreHorizIcon />} />
        </div>
        <div className='h-1/2 bg-base-200 p-4 pt-2 text-base-content'>
          <div className='card-title h-12 w-full truncate'>
            <EditableDiv
              value={name}
              setValue={setName}
              editable={nameEditable}
              onFinishEditing={updateCrossDesignName}
              autoFocus
            />
          </div>
          <div className='flex h-8 w-full justify-between'>
            <span>Last saved:</span>
            <span>{props.crossDesign.lastSaved.toLocaleDateString()}</span>
          </div>
        </div>
      </Link>

      <div
        className={`modal cursor-pointer ${
          deleteModalOpen ? 'modal-open' : ''
        }`}
        onClick={() => {
          setDeleteModalOpen(false);
        }}
      >
        <div className='modal-box relative cursor-auto'>
          <h1 className='text-lg font-bold'>
            Are you sure you want to delete &quot;{props.crossDesign.name}
            &quot;?
          </h1>
          <div className='modal-action flex justify-center'>
            <button
              className='btn btn-error'
              onClick={() => {
                deleteCrossDesign(props.crossDesign.id)
                  .then(props.refreshCrossDesigns)
                  .catch(console.error);
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
    </div>
  );
};

const copyCrossDesign = async (crossDesign: CrossDesign): Promise<void> => {
  const newCrossDesign = new CrossDesign({
    ...crossDesign,
    id: ulid(),
    name: `Copy of ${crossDesign.name}`,
    lastSaved: new Date(),
  });
  await insertCrossDesign(newCrossDesign.generateRecord());
};

const exportCrossDesign = async (crossDesign: CrossDesign): Promise<void> => {
  try {
    const dir: string | null = (await open({
      directory: true,
    })) as string | null;
    if (dir === null) return;
    const filename = crossDesign.name !== '' ? crossDesign.name : 'untitled';
    await writeTextFile(
      `${dir}${sep}${filename}.ww.json`,
      crossDesign.toJSON()
    );
    toast.success('Successfully exported crossDesign');
  } catch (err) {
    toast.error(`Error exporting crossDesign: ${err}`);
  }
};

export default CrossDesignCard;

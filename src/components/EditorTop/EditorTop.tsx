import { updateCrossDesign } from 'api/crossDesign';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import type CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { useState, useEffect } from 'react';
import { BiMenu as MenuIcon } from 'react-icons/bi';

export interface EditorTopProps {
  crossDesign: CrossDesign;
  buttons?: React.JSX.Element[];
}

const EditorTop = (props: EditorTopProps): React.JSX.Element => {
  const [name, setName] = useState('');
  const [nameEditable, setNameEditable] = useState(false);

  useEffect(() => {
    setName(props.crossDesign.name);
  }, [props.crossDesign.name]);

  const updateTreeName = (): void => {
    props.crossDesign.name = name.trim();
    updateCrossDesign(props.crossDesign.generateRecord()).catch((error) => {
      console.error(error);
    });
    setNameEditable(false);
  };

  return (
    <div className='flex flex-row justify-between border-b-4 border-b-base-300 bg-base-200 pb-2 pt-2'>
      <label htmlFor='nav-drawer' className='btn-ghost drawer-button btn ml-4'>
        <MenuIcon className='text-2xl' />
      </label>
      <div className='flex-grow pl-20 pr-10'>
        <h1 className='w-full text-left align-middle text-3xl text-base-content'>
          <EditableDiv
            value={name}
            setValue={setName}
            editable={nameEditable && props.crossDesign.editable}
            onFinishEditing={updateTreeName}
            onClick={() => {
              setNameEditable(true);
            }}
          />
        </h1>
      </div>
      <div className='mr-10 flex gap-2'>{props.buttons}</div>
    </div>
  );
};

export default EditorTop;

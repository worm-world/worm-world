import { updateCrossDesign } from 'api/crossDesign';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import type CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { useState, useEffect } from 'react';
import { BiMenu as MenuIcon } from 'react-icons/bi';
import { FaArrowsRotate as SaveIcon } from 'react-icons/fa6';

export interface EditorTopProps {
  crossDesign: CrossDesign;
  isSaving: boolean;
  lastSaved: Date;
  name: string;
  setName: (name: string) => void;
}

const EditorTop = (props: EditorTopProps): React.JSX.Element => {
  const [nameEditable, setNameEditable] = useState(false);
  const [name, setName] = useState(props.name);

  const updateTreeName = (): void => {
    props.setName(name);
    setNameEditable(false);
  };

  return (
    <div className='flex flex-row border-b-4 border-b-base-300 bg-base-200 pb-2 pt-2'>
      <label htmlFor='nav-drawer' className='btn-ghost drawer-button btn ml-4'>
        <MenuIcon className='text-2xl' />
      </label>
      <h1 className='w-1/2 text-left text-3xl text-base-content'>
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
      {props.isSaving && (
        <div className='ml-auto flex items-center gap-2 pr-10'>
          <SaveIcon />
          <span>Saving...</span>
        </div>
      )}
    </div>
  );
};

export default EditorTop;

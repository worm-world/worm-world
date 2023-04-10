import { updateTree } from 'api/crossTree';
import EditableDiv from 'components/EditableDiv/EditableDiv';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useState, useEffect } from 'react';

export interface EditorTopProps {
  tree: CrossTree;
  buttons?: JSX.Element[];
}

const EditorTop = (props: EditorTopProps): JSX.Element => {
  const [name, setName] = useState('');
  const [nameEditable, setNameEditable] = useState(false);

  useEffect(() => {
    setName(props.tree.name);
  }, [props.tree.name]);

  const updateTreeName = (): void => {
    props.tree.name = name;
    updateTree(props.tree.generateRecord(props.tree.editable)).catch((error) =>
      console.error(error)
    );
    setNameEditable(false);
  };

  return (
    <div className='flex flex-row justify-between border-b-4 border-b-base-300 bg-base-200 pt-2 pb-2'>
      <div className='flex-grow pr-10 pl-20'>
        <h1 className='w-full text-left align-middle text-3xl text-base-content'>
          <EditableDiv
            value={name}
            setValue={setName}
            editable={nameEditable && props.tree.editable}
            onFinishEditing={updateTreeName}
            onClick={() => setNameEditable(true)}
            placeholder='(Untitled)'
          />
        </h1>
      </div>
      <div className='mr-10 flex gap-2'>{props.buttons}</div>
    </div>
  );
};

export default EditorTop;

import { getFilteredStrains } from 'api/strain';
import { DynamicSelect } from 'components/DynamicSelect/DynamicSelect';
import { Sex, sexToString, stringToSex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';
import StrainBuilder from 'components/StrainBuilder/StrainBuilder';
import StrainNode from 'components/StrainNode/StrainNode';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';

export interface StrainFormProps {
  onSubmit: (sex: Sex, strain: Strain) => void;
  enforcedSex?: Sex;
}

const StrainForm = (props: StrainFormProps): JSX.Element => {
  const [sex, setSex] = useState(Sex.Male);
  const [isSelectByName, setIsSelectByName] = useState(true);
  const [previewStrain, setPreviewStrain] = useState<Strain>();

  if (props.enforcedSex !== undefined && props.enforcedSex !== sex)
    setSex(props.enforcedSex);

  return (
    <>
      <h2 className='mb-4 text-lg'>Add Strain to Design</h2>
      <div className='flex justify-center'>
        <StrainNode
          model={
            new StrainNodeModel({
              sex,
              strain: previewStrain ?? new Strain({ allelePairs: [] }),
              isParent: false,
              isChild: false,
            })
          }
        />
      </div>
      <div className='divider' />
      <div className='form-control w-full max-w-xs'>
        <SexSelect
          sex={sex}
          setSex={setSex}
          disabled={props.enforcedSex !== undefined}
        />
        {isSelectByName ? (
          <StrainSelect
            onSubmit={(strain) => {
              props.onSubmit(sex, strain);
            }}
            setPreview={setPreviewStrain}
          />
        ) : (
          <StrainBuilder
            onSubmit={(strain) => {
              props.onSubmit(sex, strain);
            }}
            setPreview={setPreviewStrain}
          />
        )}
      </div>
      <label className='swap mt-auto'>
        <input
          type='checkbox'
          checked={isSelectByName}
          onChange={() => {
            setIsSelectByName(!isSelectByName);
            setPreviewStrain(undefined);
          }}
        />
        <div className='swap-on'>Build custom strain instead</div>
        <div className='swap-off'>Select strain by name instead</div>
      </label>
    </>
  );
};

const StrainSelect = (props: {
  setPreview?: (strain?: Strain) => void;
  onSubmit: (strain: Strain) => void;
}): JSX.Element => {
  const [strain, setStrain] = useState<Strain>();
  const [userInput, setUserInput] = useState('');

  const setStrainWithPreview = (strain?: Strain): void => {
    setStrain(strain);
    props.setPreview?.(strain);
  };

  return (
    <>
      <DynamicSelect
        userInput={userInput}
        setUserInput={setUserInput}
        label={'Strain'}
        getFilteredRecord={getFilteredStrains}
        searchOn={'Name'}
        selectInputOn={'name'}
        fieldsToDisplay={['name']}
        selectedRecord={strain?.generateRecord()}
        setSelectedRecord={(record) => {
          record === undefined
            ? setStrainWithPreview(undefined)
            : Strain.createFromRecord(record)
                .then(setStrainWithPreview)
                .catch(console.error);
        }}
      />
      <button
        className='btn-primary btn max-w-xs'
        disabled={strain === undefined}
        onClick={() => {
          if (strain !== undefined) {
            props.onSubmit(strain);
            setStrainWithPreview(undefined);
            setUserInput('');
          }
        }}
      >
        Add Strain
      </button>
    </>
  );
};

const SexSelect = (props: {
  sex: Sex;
  setSex: (sex: Sex) => void;
  disabled: boolean;
}): JSX.Element => {
  return (
    <>
      <label className='label'>
        <span className='label-text'>Sex</span>
      </label>
      <select
        disabled={props.disabled}
        onChange={(event) => {
          props.setSex(stringToSex(event.target.value));
        }}
        value={sexToString(props.sex)}
        className='select-bordered select w-full max-w-xs'
      >
        <option value={sexToString(Sex.Male)}>male</option>
        <option value={sexToString(Sex.Hermaphrodite)}>hermaphrodite</option>
      </select>
    </>
  );
};

export default StrainForm;

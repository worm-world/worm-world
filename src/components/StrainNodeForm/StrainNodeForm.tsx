import StrainBuilder from 'components/StrainBuilder/StrainBuilder';
import { Sex, sexToString, stringToSex } from 'models/enums';
import { type Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';

export interface StrainNodeFormProps {
  onSubmit: (sex: Sex, strain: Strain) => void;
  enforcedSex?: Sex;
}

// StrainNode form specifies a new strain node
const StrainNodeForm = (props: StrainNodeFormProps): JSX.Element => {
  const [sex, setSex] = useState(Sex.Male);
  if (props.enforcedSex !== undefined && props.enforcedSex !== sex)
    setSex(props.enforcedSex);

  return (
    <>
      <h2 className='text-lg'>Add a Strain</h2>
      <SexSelector
        sex={sex}
        setSex={setSex}
        disabled={props.enforcedSex !== undefined}
      />
      <StrainBuilder
        onSubmit={(strain) => {
          props.onSubmit(sex, strain);
        }}
      />
    </>
  );
};

const SexSelector = (props: {
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
        className='select-bordered select mb-4 w-full max-w-xs'
      >
        <option value={sexToString(Sex.Male)}>male</option>
        <option value={sexToString(Sex.Hermaphrodite)}>hermaphrodite</option>
      </select>
    </>
  );
};
export default StrainNodeForm;

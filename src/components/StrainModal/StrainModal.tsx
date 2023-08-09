import { type Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';
import { toast } from 'react-toastify';

export interface StrainModalState {
  isOpen: boolean;
  strain?: Strain;
}

interface StrainModalProps {
  state: StrainModalState;
  setIsOpen: (isOpen: boolean) => void;
}

const StrainModal = (props: StrainModalProps): React.JSX.Element => {
  const [strainNameInput, setStrainNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const strain = props.state.strain;
  return (
    <div>
      <input
        type='checkbox'
        className='modal-toggle'
        defaultChecked={props.state.isOpen}
      />
      <div className='modal'>
        <div className='modal-box'>
          <h2 className='text-lg font-bold'>
            Please choose a name for this strain
          </h2>
          <p>{strain?.genotype}</p>
          <div className='form-control'>
            <div className='my-2'>
              <label className='label' htmlFor='strain-name-input'>
                Strain name
              </label>
              <input
                className='input input-bordered w-full py-4'
                id='strain-name-input'
                value={strainNameInput}
                onChange={(e) => {
                  setStrainNameInput(e.target.value);
                }}
              />
            </div>
            <div className='my-2'>
              <label className='label' htmlFor='strain-description-textarea'>
                Description
              </label>
              <textarea
                className='textarea textarea-bordered w-full py-4'
                id='strain-description-textarea'
                value={descriptionInput}
                onChange={(e) => {
                  setDescriptionInput(e.target.value);
                }}
              />
            </div>
            <div className='modal-action'>
              <button
                disabled={strainNameInput === ''}
                className='btn btn-primary my-2'
                onClick={() => {
                  if (strain === undefined) return;
                  strain.name = strainNameInput;
                  strain.description = descriptionInput;
                  strain
                    .save()
                    .then(() => toast.success('Saved strain'))
                    .catch(() =>
                      toast.error(
                        'Unable to save strain. Make sure that this genotype has not already been saved under a different name.'
                      )
                    );
                  props.setIsOpen(false);
                }}
              >
                Save strain
              </button>
            </div>
          </div>
        </div>
        <label
          className='modal-backdrop'
          onClick={() => {
            props.setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default StrainModal;

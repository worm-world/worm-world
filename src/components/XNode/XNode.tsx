import { BiX as CloseIcon } from 'react-icons/bi';

export interface XNodeProps {
  setCurrChildNodes?: () => void;
}

export const XNode = (props: XNodeProps): JSX.Element => {
  return (
    <label htmlFor='cross-filter-modal' onClick={props.setCurrChildNodes}>
      <div className='h-16 w-16 rounded-full bg-primary p-4 shadow transition hover:bg-primary-focus'>
        <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};

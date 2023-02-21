import { BiX as CloseIcon } from 'react-icons/bi';

export interface XNodeProps {
  setCurrChildNodes?: () => void;
  setCurrFilter?: () => void;
}

export const XNode = (props: XNodeProps): JSX.Element => {
  const clickHandler = (): void => {
    if (props.setCurrChildNodes !== undefined) props.setCurrChildNodes();
    if (props.setCurrFilter !== undefined) props.setCurrFilter();
  };

  return (
    <label htmlFor='cross-filter-modal' onClick={clickHandler}>
      <div className='h-16 w-16 rounded-full bg-primary p-4 shadow transition hover:bg-primary-focus'>
        <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};

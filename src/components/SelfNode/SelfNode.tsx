import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';

export interface SelfIconProps {
  setCurrChildNodes?: () => void;
  setCurrFilter?: () => void;
}

export const SelfNode = (props: SelfIconProps): JSX.Element => {
  const clickHandler = (): void => {
    if (props.setCurrChildNodes !== undefined) props.setCurrChildNodes();
    if (props.setCurrFilter !== undefined) props.setCurrFilter();
  };

  return (
    <label htmlFor='cross-filter-modal' onClick={clickHandler}>
      <div className='h-16 w-16 rounded-full bg-secondary p-4 shadow transition hover:bg-secondary-focus'>
        <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};

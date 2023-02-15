import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';

export interface SelfIconProps {
  setCurrChildNodes?: () => void;
}

export const SelfNode = (props: SelfIconProps): JSX.Element => {
  return (
    <label htmlFor='cross-filter-modal' onClick={props.setCurrChildNodes}>
      <div className='h-16 w-16 rounded-full bg-secondary p-4 shadow transition hover:bg-secondary-focus'>
        <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};

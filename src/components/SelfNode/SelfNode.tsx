import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';

export interface SelfIconProps {
  id: string;
}

export const SelfNode = (props: SelfIconProps): JSX.Element => {
  return (
    <label key={props.id} htmlFor={`cross-filter-modal-${props.id}`}>
      <div className='h-16 w-16 rounded-full bg-secondary p-4 shadow transition hover:cursor-pointer hover:bg-secondary-focus'>
        <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
    </label>
  );
};

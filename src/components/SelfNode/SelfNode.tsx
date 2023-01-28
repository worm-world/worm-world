import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';

export const SelfNode = (): JSX.Element => {
  return (
    <div className='h-16 w-16 rounded-full bg-secondary p-4 shadow shadow transition hover:bg-secondary-focus'>
      <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
    </div>
  );
};

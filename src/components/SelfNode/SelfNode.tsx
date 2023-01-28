import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';

export const SelfNode = (): JSX.Element => {
  return (
    <div className='h-16 w-16 rounded-full bg-secondary shadow transition hover:bg-secondary-focus'>
      <div className='flex h-full items-center justify-center'>
        <SelfIcon className='text-3xl text-primary-content' />
      </div>
    </div>
  );
};

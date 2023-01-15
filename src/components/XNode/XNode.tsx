import { BiX as CloseIcon } from 'react-icons/bi';

export const XNode = (): JSX.Element => {
  return (
    <div className='h-16 w-16 rounded-full bg-primary shadow transition hover:bg-primary-focus'>
      <div className='flex h-full items-center justify-center'>
        <CloseIcon className='text-3xl text-primary-content' />
      </div>
    </div>
  );
};

import { BiX as CloseIcon } from 'react-icons/bi';

export const XNode = (): JSX.Element => {
  return (
    <div className='h-16 w-16 p-4 rounded-full bg-primary shadow transition hover:bg-primary-focus'>
        <CloseIcon className='text-3xl text-primary-content w-8 h-8' />
    </div>
  );
};

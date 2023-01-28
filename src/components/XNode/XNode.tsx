import { BiX as CloseIcon } from 'react-icons/bi';

export const XNode = (): JSX.Element => {
  return (
    <div className='h-16 w-16 rounded-full bg-primary p-4 shadow transition hover:bg-primary-focus'>
      <CloseIcon className='h-8 w-8 text-3xl text-primary-content' />
    </div>
  );
};

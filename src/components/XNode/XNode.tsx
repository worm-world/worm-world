import {BiX as CloseIcon} from 'react-icons/bi';

export const XNode = (): JSX.Element => {
  return (
    <div className='rounded-full shadow bg-primary hover:bg-primary-focus transition h-16 w-16'>
      <div className='flex justify-center items-center h-full'>
        <CloseIcon className='text-primary-content text-3xl'/>
      </div>
    </div>
  );
};

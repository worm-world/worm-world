import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import CloseIcon from '@mui/icons-material/Close';

export const XNode = (): ReactJSXElement => {
  return (
    <div className='rounded-full shadow bg-primary hover:bg-primary-focus transition h-16 w-16'>
      <div className='flex justify-center items-center h-full'>
        <CloseIcon fontSize='large' className='text-primary-content'></CloseIcon>
      </div>
    </div>
  );
};

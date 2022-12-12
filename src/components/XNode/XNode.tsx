import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export const XNode = (): ReactJSXElement => {
  return (
    <div className='rounded-full border-solid shadow bg-gray-50 hover:bg-gray-100 h-16 w-16'>
      <div className='flex justify-center items-center h-full'>
        <CloseIcon fontSize='large'></CloseIcon>
      </div>
    </div>
  );
};

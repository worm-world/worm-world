import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Handle, Position } from 'reactflow';

export const XNode = (): ReactJSXElement => {
  return (
    <div className='rounded-full border-2 shadow bg-white hover:bg-gray-100 h-16 w-16'>
      <Handle type='target' position={Position.Top} />
      <div className='flex justify-center items-center h-full'>
        <CloseIcon fontSize='large'></CloseIcon>
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  );
};

import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const CrossDesigner = (): JSX.Element => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CrossDesigner;

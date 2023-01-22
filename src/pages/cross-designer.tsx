import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const CrossDesigner = (): JSX.Element => {
  const [currentTreeId, setCurrentTreeId] = useState(-1);
  return (
    <div>
      <Outlet context={[currentTreeId, setCurrentTreeId]} />
    </div>
  );
};

export default CrossDesigner;

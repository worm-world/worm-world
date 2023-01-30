import React from 'react';

export interface IConditionalProps {
  condition: boolean;
  children: React.ReactNode;
}

const Conditional = (props: IConditionalProps): any => {
  if (props.condition) {
    return props.children;
  }

  return <></>;
};

export default Conditional;

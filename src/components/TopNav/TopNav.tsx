import * as React from 'react';
interface iTopNavInputProps {
  title: string;
  children?: JSX.Element[];
  tabIndex?: number | false;
}

export function TopNav(props: iTopNavInputProps): JSX.Element {
  const tabIndex = props.tabIndex === undefined ? 0 : props.tabIndex;
  const [getTabId, SetTabId] = React.useState(tabIndex);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ): void => {
    SetTabId(newValue);
  };

  return (
    <div className='justify-left flex flex-row bg-base-200 pt-4 pb-4 border-b-4 border-b-base-300'>
      <h1 className='pl-24 text-3xl text-base-content'>{props.title}</h1>
      <div className='flex flex-col justify-end pl-10'>
        <div className='tabs' role='tablist' aria-label='Tabs'>
          {props.children?.map((item) => (
            <div className='tab' key={item.key}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

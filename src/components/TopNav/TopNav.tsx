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
    <div className="bg-base-200 flex pt-4 pb-4 flex-row justify-left">
      <h1 className="text-base-content pl-24 text-3xl">{props.title}</h1>
      <div className="pl-10 flex flex-col justify-end">
        <div className="tabs" role="tablist" aria-label="Tabs">
          {props.children?.map(item => <div className='tab' key={item.key}>{item}</div>)}
        </div>
      </div>
    </div>
  );
}

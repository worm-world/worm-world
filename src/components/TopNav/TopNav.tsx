import * as React from 'react';
interface iTopNavInputProps {
  title: string;
  children?: JSX.Element[];
  tabIndex?: number | false;
  rightButton?: JSX.Element;
}

export function TopNav(props: iTopNavInputProps): JSX.Element {
  const initialTabIdx = props.tabIndex === undefined ? 0 : props.tabIndex;
  const [tabIdx, setTabIdx] = React.useState(initialTabIdx);

  // const handleTabChange = (
  //   _event: React.SyntheticEvent,
  //   newValue: number
  // ): void => {
  //   setTabIdx(newValue);
  // };

  return (
    <div className='justify-left flex flex-row border-b-4 border-b-base-300 bg-base-200 pt-4 pb-4'>
      <h1 className='pl-24 text-3xl text-base-content'>{props.title}</h1>
      <div className='flex flex-col justify-end pl-10'>
        <div className='tabs' role='tablist' aria-label='Tabs'>
          {props.children?.map((item, idx) => (
            <div
              className={
                'tab tab-lifted' + (tabIdx === idx ? ' tab-active' : '')
              }
              key={item.key}
              onClick={() => setTabIdx(idx)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {props.rightButton}
    </div>
  );
}

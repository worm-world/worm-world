import * as React from 'react';
interface iTopNavInputProps {
  title: string;
  children?: JSX.Element[];
  tabIndex?: number | false;
  buttons?: JSX.Element[];
}

export function TopNav(props: iTopNavInputProps): JSX.Element {
  const initialTabIdx = props.tabIndex === undefined ? 0 : props.tabIndex;
  const [tabIdx, setTabIdx] = React.useState(initialTabIdx);
  return (
    <div className='justify-left flex flex-row border-b-4 border-b-base-300 bg-base-200 pt-4 pb-4'>
      <h1 className='pl-24 text-3xl text-base-content'>{props.title}</h1>
      <div className='flex flex-col justify-end pl-10'>
        <div className='tabs' role='tablist' aria-label='Tabs'>
          {props.children?.map((item, idx) => (
            <div
              className={
                'tab tab-bordered ' + (tabIdx === idx ? ' tab-active' : '')
              }
              key={item.key}
              onClick={() => setTabIdx(idx)}
              role='tab'
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className='ml-auto mr-10 flex gap-2'>{props.buttons}</div>
    </div>
  );
}

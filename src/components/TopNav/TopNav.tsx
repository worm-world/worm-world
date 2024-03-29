import * as React from 'react';
import { BiMenu as MenuIcon } from 'react-icons/bi';
interface TopNavInputProps {
  title: string;
  children?: React.JSX.Element[];
  tabIndex?: number | false;
  buttons?: React.JSX.Element[];
}

export function TopNav(props: TopNavInputProps): React.JSX.Element {
  const initialTabIdx = props.tabIndex === undefined ? 0 : props.tabIndex;
  const [tabIdx, setTabIdx] = React.useState(initialTabIdx);
  return (
    <div className='justify-left flex flex-row items-center bg-base-200 py-4 shadow-md'>
      <label htmlFor='nav-drawer' className='btn btn-ghost drawer-button ml-4'>
        <MenuIcon className='text-2xl' />
      </label>
      <h1 className='ml-4 content-center text-3xl text-base-content'>
        {props.title}
      </h1>
      <div className='flex flex-col justify-end pl-10'>
        <div className='tabs' role='tablist' aria-label='Tabs'>
          {props.children?.map((item, idx) => (
            <div
              className={
                'tab tab-bordered ' + (tabIdx === idx ? ' tab-active' : '')
              }
              key={item.key}
              onClick={() => {
                setTabIdx(idx);
              }}
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

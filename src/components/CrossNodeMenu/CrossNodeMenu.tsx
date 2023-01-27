import React from 'react';
import { IconType } from 'react-icons';

export interface MenuItem {
  // icon?: IconType;
  text: string;
  menuCallback: () => void;
}

interface iCrossNodeMenu {
  items: MenuItem[];
}

export const CrossNodeMenu = (props: iCrossNodeMenu): JSX.Element => {
  return (
    <ul className=' menu rounded-box menu-compact w-40 bg-base-200 p-2'>
      {props.items.map((item, idx) => MenuOption(item, idx))}
    </ul>
  );
};

const MenuOption = (item: MenuItem, key: number): JSX.Element => {
  // const useIcon = item.icon !== undefined;
  return (
    <li key={key}>
      <a onClick={item.menuCallback}>
        {/* {useIcon ? <div>{item.icon}</div> : <div></div>} */}
        {item.text}
      </a>
    </li>
  );
};

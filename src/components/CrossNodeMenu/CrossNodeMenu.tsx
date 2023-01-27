import React from 'react';
import { Sex } from 'models/enums';
import CrossNode from 'models/frontend/CrossNode/CrossNode';
import {
  BsLightningCharge as MenuIcon,
  BsUiChecks as ScheduleIcon,
} from 'react-icons/bs';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';

export interface MenuItem {
  icon?: JSX.Element;
  text: string;
  menuCallback: () => void;
}

export interface iCrossNodeMenu {
  items: MenuItem[];
}

export const CrossNodeMenu = (props: iCrossNodeMenu): JSX.Element => {
  return (
    <div className='dropdown z-10' data-testid={'crossNodeMenu'}>
      <label tabIndex={0} className='btn-ghost btn-sm btn m-1 text-xl'>
        <MenuIcon />
      </label>
      {props.items.length > 0 && (
        <ul
          tabIndex={0}
          className=' dropdown-content menu menu-compact w-40 rounded-md bg-base-100 p-1 drop-shadow-lg'
        >
          <li className='menu-title'>
            <span>Actions</span>
          </li>
          {props.items.map((item, idx) => MenuOption(item, idx))}
        </ul>
      )}
    </div>
  );
};

const MenuOption = (item: MenuItem, key: number): JSX.Element => {
  const useIcon = item.icon !== undefined;
  return (
    <li key={key}>
      <a onClick={item.menuCallback}>
        {useIcon ? <div>{item.icon}</div> : <div></div>}
        {item.text}
      </a>
    </li>
  );
};

export const getMenuItems = (node: CrossNode): MenuItem[] => {
  const canSelfCross = node.sex === Sex.Hermaphrodite;
  const selfOption: MenuItem = {
    icon: <SelfCrossIcon />,
    text: 'Self cross',
    menuCallback: () => {
      const strains = node.strain.selfCross();
      const strainOutput = strains
        .map(
          (strain, idx) =>
            `Strain: ${idx} -- Prob: ${
              strain.prob
            }\n${strain.strain.toString()}`
        )
        .join('\n\n');
      alert(strainOutput);
    },
  };
  const crossOption: MenuItem = {
    icon: <CrossIcon />,
    text: 'Cross',
    menuCallback: () => {
      alert('not yet implemented');
    },
  };
  const exportOption: MenuItem = {
    icon: <ScheduleIcon />,
    text: 'Schedule',
    menuCallback: () => {
      alert('not yet implemented');
    },
  };

  const items = [crossOption, exportOption];
  if (canSelfCross) items.unshift(selfOption);

  return items;
};

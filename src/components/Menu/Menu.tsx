export interface MenuItem {
  icon?: React.JSX.Element;
  text: string;
  menuCallback: () => void;
}

export interface MenuProps {
  items: MenuItem[];
  icon: React.JSX.Element;
  title: string;
  top?: boolean;
}

export const Menu = (props: MenuProps): React.JSX.Element => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`dropdown ${props.top === true ? 'dropdown-top' : ''}`}
      data-testid={'menu'}
    >
      <label
        tabIndex={0}
        className='btn btn-ghost btn-xs m-1 text-base ring-0 hover:bg-base-200 hover:ring-0'
      >
        {props.icon}
      </label>
      {props.items.length > 0 && (
        <ul
          tabIndex={0}
          className='menu-compact menu dropdown-content z-50 w-40 rounded-md bg-base-100 p-1 drop-shadow-lg'
        >
          <li className='menu-title'>
            <span>{props.title}</span>
          </li>
          {props.items.map((item, idx) => MenuOption(item, idx))}
        </ul>
      )}
    </div>
  );
};

const MenuOption = (item: MenuItem, key: number): React.JSX.Element => {
  const useIcon = item.icon !== undefined;
  return (
    <li key={key}>
      <div onClick={item.menuCallback}>
        {useIcon ? <div>{item.icon}</div> : <div></div>}
        {item.text}
      </div>
    </li>
  );
};

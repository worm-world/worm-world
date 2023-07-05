import { useState, useCallback, useEffect } from 'react';

export const useContextMenuState = (
  elementClasses: string[],
  testing: boolean = false
): {
  rightClickXPos: number;
  rightClickYPos: number;
  showRightClickMenu: boolean;
} => {
  const [rightClickXPos, setXPos] = useState(0);
  const [rightClickYPos, setYPos] = useState(0);
  const [showRightClickMenu, setShowMenu] = useState(testing);

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (e.target !== undefined) {
        const target = e.target as HTMLElement;
        for (const elementClass of elementClasses) {
          if (target.classList.contains(elementClass)) {
            e.preventDefault();
            setShowMenu(true);
            setXPos(e.pageX);
            setYPos(e.pageY);
            return;
          }
        }
      } else {
        setShowMenu(false);
      }
    },
    [setXPos, setYPos, elementClasses]
  );

  const handleClick = useCallback(() => {
    showRightClickMenu && setShowMenu(false);
  }, [showRightClickMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { rightClickXPos, rightClickYPos, showRightClickMenu };
};

interface ContextMenuProps {
  children: React.ReactNode | React.ReactNode[];
  xPos: number;
  yPos: number;
}

export const ContextMenu = (props: ContextMenuProps): React.JSX.Element => {
  return (
    <div
      data-testid='context-menu'
      className='absolute z-50 shadow-md'
      style={{ top: props.yPos, left: props.xPos }}
    >
      <ul className='menu-compact menu w-48 rounded-md bg-base-100 p-1 '>
        {props.children}
      </ul>
    </div>
  );
};

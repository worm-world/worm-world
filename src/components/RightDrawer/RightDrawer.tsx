import styles from './RightDrawer.module.css';
import React, { useState } from 'react';
import { BiX as CloseIcon } from 'react-icons/bi';

export interface RightDrawerProps {
  className?: string;
  initialDrawerWidth: number;
  maxWidth: number;
  isOpen: boolean;
  close: () => void;
  backgroundColor?: string;
  children?: JSX.Element | JSX.Element[];
}

const RightDrawer = (props: RightDrawerProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(props.initialDrawerWidth);
  const [mousePosition, setMousePosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  // Draggable
  React.useEffect(() => {
    const calculateNewWidth = (ev: MouseEvent): void => {
      const widthChange = mousePosition.x - ev.clientX;
      const newWidth = drawerWidth + widthChange;
      if (isDragging) {
        setDrawerWidth(newWidth);
      }
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    const endDragging = (): void => setIsDragging(false);

    window.addEventListener('mousemove', calculateNewWidth);
    window.addEventListener('mouseup', endDragging);

    return () => {
      window.removeEventListener('mousemove', calculateNewWidth);
      window.removeEventListener('mouseup', endDragging);
    };
  }, [isDragging]);

  return (
    <div
      className={'flex flex-row bg-base-100 ' + (props.className ?? '')}
      style={{
        width: drawerWidth,
        minWidth: 'fit-content',
        maxWidth: props.maxWidth,
      }}
    >
      <div
        className={`${styles.resizerThumb} ${
          isDragging ? styles.resizerThumbDragging : ''
        } `}
        onMouseDown={() => setIsDragging(true)}
      />
      <div className='flex w-full flex-col justify-start'>
        <div className='flex flex-row justify-end'>
          <button className='m-2' onClick={() => props.close()}>
            <CloseIcon className='pr-2 text-3xl' />
          </button>
        </div>
        <div className={styles.drawerContents}>{props.children}</div>
      </div>
    </div>
  );
};

export default RightDrawer;

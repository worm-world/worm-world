import { Drawer, Box, IconButton } from '@mui/material';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import styles from './RightDrawer.module.css';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export interface RightDrawerProps {
  className?: string;
  initialDrawerWidth: number;
  maxWidth: number;
  isOpen: boolean;
  close: () => void;
  backgroundColor?: string;
  children?: JSX.Element | JSX.Element[];
}

const RightDrawer = (props: RightDrawerProps): ReactJSXElement => {
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
    <Drawer
      className={props.className}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          minWidth: 'fit-content',
          maxWidth: props.maxWidth,
          backgroundColor: props.backgroundColor,
        },
      }}
      variant='persistent'
      anchor='right'
      open={props.isOpen}
    >
      <Box
        className={`${styles.resizerThumb} ${isDragging ? styles.resizerThumbDragging : ''} `}
        onMouseDown={() => setIsDragging(true)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton
            onClick={() => props.close()}
            sx={{ border: 'none', boxShadow: 'none' }}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </Box>
        <Box className={styles.drawerContents}>{props.children}</Box>
      </Box>
    </Drawer>
  );
};

export default RightDrawer;

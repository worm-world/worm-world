import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import styles from './TopNav.module.css';
interface iTopNavInputProps {
  title: string;
  children: any;
}

export function TopNav(props: iTopNavInputProps): JSX.Element {
  return (
    <div className={styles['TopNav-container']}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.container}>
        <Tabs value={0}>{props.children}</Tabs>
      </div>
    </div>
  );
}

import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import styles from './TopNav.module.css';
interface iTopNavInputProps {
  title: string;
  children?: any;
  tabIndex?: number | false;
}

export function TopNav(props: iTopNavInputProps): JSX.Element {
  const tabIndex = props.tabIndex === undefined ? 0 : props.tabIndex;
  const [getTabId, SetTabId] = React.useState(tabIndex);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ): void => {
    SetTabId(newValue);
  };

  return (
    <div className={styles['TopNav-container']}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.container}>
        <Tabs value={getTabId} onChange={handleTabChange}>
          {props.children}
        </Tabs>
      </div>
    </div>
  );
}

import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';

const Schedules = (): JSX.Element => {
  return (
    <>
      <TopNav title={'Schedules'} tabIndex={1}>
        {[
          <Link key='todo' to='todo'>
            To Do
          </Link>,
        ]}
      </TopNav>
      <div className='px-6 pt-2'>
        <Outlet />
      </div>
    </>
  );
};

export default Schedules;

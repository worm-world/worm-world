import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';

const Todo = (): JSX.Element => {
  return (
    <>
      <TopNav title={'Scheduler'} tabIndex={1}>
        {[
          <Link key='todo' to='todo'>
            ToDo
          </Link>,
        ]}
      </TopNav>
      <div className='px-6 pt-2'>
        <Outlet />
      </div>
    </>
  );
};

export default Todo;

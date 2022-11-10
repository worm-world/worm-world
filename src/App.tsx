import * as React from 'react';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { User } from './models/User';

function App(): JSX.Element {
  const [users, setUsers] = React.useState<User[]>([]);
  const getUsersFromDB = (): void => {
    invoke('get_users')
      .then((m) => {
        setUsers(m as User[]);
        console.log(users);
      })
      .catch((m) => console.log('Unable to get users from db'));
  };

  React.useEffect(getUsersFromDB, []);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sendInput = (): void => {
    if (inputRef.current != null && inputRef.current.value.length > 0) {
      invoke('insert_user', { name: inputRef.current.value })
        .then((m) => {
          getUsersFromDB();
        })
        .catch((m) => console.log('Unable to insert user into db'));
      console.log('Sent input');
    }
  };

  return (
    <div className='App'>
      <div className='App-header'>Welcome to this app.</div>
      <div>
        <div>
          <button onClick={sendInput}>Add New User</button>
          <input ref={inputRef} type='text' />
        </div>
        <h2>Users Queried from the Database:</h2>
        <ul>
          {users.map((u) => (
            <li key={String(u.id)}>{`${u.id.toString()}: ${u.userName}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

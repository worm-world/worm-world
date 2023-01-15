import React, { Suspense, FC } from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/global.css';
import Layout from 'components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import routes from '~react-pages';
import SideNav from 'components/SideNav/SideNav';

const App: FC = () => {
  return (
    <>
      <Suspense fallback={<p className='text-base-content'>Loading...</p>}>
        <Layout>{useRoutes(routes)}</Layout>
      </Suspense>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        position='bottom-right'
        closeOnClick={false}
      />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

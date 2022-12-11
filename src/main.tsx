import React, { Suspense, FC } from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/global.css';
import Layout from 'components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import routes from '~react-pages';

const App: FC = () => {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <main style={{ width: '100%', height: '100%' }}>
          <Layout>{useRoutes(routes)}</Layout>
        </main>
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

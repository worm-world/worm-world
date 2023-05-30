import 'reflect-metadata';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import Spinner from 'components/Spinner/Spinner';
import Layout from 'components/Layout/Layout';

const App = (): JSX.Element => {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Layout> {useRoutes(routes)}</Layout>
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

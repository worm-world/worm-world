import React, { Suspense, FC } from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/global.css';
import Layout from 'components/layout/layout';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import routes from '~react-pages';

const App: FC = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <main>
        <Layout>{useRoutes(routes)}</Layout>
      </main>
    </Suspense>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

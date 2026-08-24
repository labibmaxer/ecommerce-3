/**
 *
 * app.js
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store, { history } from './store';
import { SocketProvider } from './contexts/Socket';
import { SET_AUTH } from './containers/Authentication/constants';
import Application from './containers/Application';
import ScrollToTop from './scrollToTop';
import setToken from './utils/token';

// Import application sass styles
import './styles/style.scss';

// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';

// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';

// react-bootstrap-table2 styles
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// rc-slider style
import 'rc-slider/assets/index.css';

// Authentication
const token = localStorage.getItem('token');

if (token) {
  // authenticate api authorization
  setToken(token);

  // authenticate routes
  store.dispatch({ type: SET_AUTH });
}

// Global JS-level safety handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', function (event) {
    // prevent white-screen due to uncaught errors; keep console record
    try {
      console.error('Global error:', event.error || event.message, event);
    } catch (e) {}
  });

  window.addEventListener('unhandledrejection', function (event) {
    try {
      console.error('Unhandled rejection:', event.reason);
    } catch (e) {}
  });
}

import ErrorBoundary from './components/Common/ErrorBoundary';

const app = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <SocketProvider>
        <ScrollToTop>
          <ErrorBoundary>
            <Application />
          </ErrorBoundary>
        </ScrollToTop>
      </SocketProvider>
    </ConnectedRouter>
  </Provider>
);

export default app;

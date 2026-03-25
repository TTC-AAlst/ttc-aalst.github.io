import React from 'react';
import ReactDOM from "react-dom/client";
import {Provider} from 'react-redux';
import Routes from './routes';
import {store} from './store';

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
);

import './utils/dayjsSetup';

import './index.scss';

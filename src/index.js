import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game/Game';
import reportWebVitals from './Core/reportWebVitals';
import { sendToVercelAnalytics } from './Core/vitals';

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

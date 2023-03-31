import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './components/App';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

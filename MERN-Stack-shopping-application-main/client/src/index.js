import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    browser: true,
    version: '',
    versions: {},
    nextTick: (callback, ...args) => Promise.resolve().then(() => callback(...args))
  };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

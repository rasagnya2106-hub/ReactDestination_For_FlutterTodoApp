import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}
const root = createRoot(container);

let firstFrameDispatched = false;

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (!firstFrameDispatched) {
  window.dispatchEvent(new CustomEvent('flutter-first-frame'));
  firstFrameDispatched = true;
}
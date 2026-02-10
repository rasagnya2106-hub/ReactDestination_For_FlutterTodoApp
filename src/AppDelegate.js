import React from 'react';
import { createRoot } from 'react-dom/client';
import * as GeneratedPluginRegistrant from './GeneratedPluginRegistrant';
import App from './App';

class AppDelegate {
  static initialise() {
    try {
      GeneratedPluginRegistrant.register();
    } catch (e) {
      console.error('Plugin registration failed:', e);
      return false;
    }

    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element with id "root" not found.');
      return false;
    }

    try {
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      return true;
    } catch (e) {
      console.error('React rendering failed:', e);
      return false;
    }
  }
}

export default AppDelegate;
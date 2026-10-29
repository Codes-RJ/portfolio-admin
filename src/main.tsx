import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const enableWebFonts = () => {
  const stylesheet = document.getElementById('portfolio-fonts') as HTMLLinkElement | null;
  if (stylesheet) stylesheet.media = 'all';
};

const idleWindow = window as typeof window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

if (idleWindow.requestIdleCallback) {
  idleWindow.requestIdleCallback(enableWebFonts, { timeout: 1500 });
} else {
  window.setTimeout(enableWebFonts, 0);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>
);

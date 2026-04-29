import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Prevent browser scroll-restoration on reload/back-forward.
// Must be synchronous — if set inside a useEffect, the browser may have
// already queued a scroll-restore before React's effects run.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// Belt-and-suspenders: snap to top now, before any React paint.
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

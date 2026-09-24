import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AOS from 'aos';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import './index.css'; // our own CSS comes last so it can adjust Bootstrap

import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Start AOS once. Animations run one time only, and are skipped for people
// who asked their system to reduce motion.
AOS.init({
  duration: 500,
  once: true,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import SignIn from './components/auth/SignIn';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  </StrictMode>
);
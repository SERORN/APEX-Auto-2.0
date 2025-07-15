import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import CatalogView from './pages/CatalogView';
import SignupView from './pages/SignupView';
import HomeView from './pages/HomeView';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<HomeView />} />
      <Route path="/catalog" element={<CatalogView />} />
      <Route path="/signup" element={<SignupView />} />
    </Routes>
  </Router>
);

export default AppRouter;

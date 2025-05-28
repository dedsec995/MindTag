import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import './App.css'; // Global app styles (optional)
import './index.css'; // Global index styles (optional)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:bookId" element={<BookDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
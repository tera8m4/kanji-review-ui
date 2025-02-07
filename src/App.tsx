// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WordReview from './components/WordReview';
import './App.css'; // You can have global styles here
import KanjiList from './components/KanjiList';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<KanjiList />} />
          <Route path="/review/:kanji" element={<WordReview />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
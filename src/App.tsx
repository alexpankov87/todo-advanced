import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskDetailsPage from './pages/TaskDetailsPage';

function App() {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/task/:id" element={<TaskDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
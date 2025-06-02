import React, { useState, useEffect } from 'react';
import { Calculator } from './components/Calculator';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
      <Calculator />
    </div>
  );
}

export default App;
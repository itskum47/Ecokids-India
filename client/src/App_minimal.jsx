import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div style={{
      backgroundColor: 'lightgreen', 
      padding: '50px', 
      fontSize: '24px',
      color: 'darkgreen'
    }}>
      <h1>🟢 MINIMAL APP TEST</h1>
      <p>If you see this, the issue is with one of the complex imports</p>
      <Routes>
        <Route path="/" element={<div>✅ Basic routing works</div>} />
      </Routes>
    </div>
  );
}

export default App;
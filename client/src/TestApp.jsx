import React from 'react';

const TestApp = () => {
  console.log('🔥 TestApp is rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to right, #22c55e, #16a34a)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🌍 EcoKids India - Test Page</h1>
      <p>If you can see this, React is working properly!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'white',
          color: '#22c55e',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp;
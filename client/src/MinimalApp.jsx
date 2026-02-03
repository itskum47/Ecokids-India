import React from 'react';

function MinimalApp() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#059669',
          marginBottom: '20px'
        }}>
          🌱 EcoKids India
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Testing if React is working...
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          maxWidth: '600px'
        }}>
          <div style={{
            backgroundColor: '#dcfce7',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#166534' }}>🧪 Experiments</h3>
            <p style={{ color: '#15803d', fontSize: '14px' }}>
              Science experiments page
            </p>
          </div>
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#1e40af' }}>🎮 Games</h3>
            <p style={{ color: '#1d4ed8', fontSize: '14px' }}>
              Educational games
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;
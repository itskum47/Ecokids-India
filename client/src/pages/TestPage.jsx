import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🧪 Test Experiments Page
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          This is a test page using inline styles to check if the basic component is working.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#dcfce7',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Water Quality Testing</h3>
            <p style={{ color: '#15803d', fontSize: '0.875rem' }}>
              Learn how to test water quality using simple household items.
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Air Quality Monitor</h3>
            <p style={{ color: '#1d4ed8', fontSize: '0.875rem' }}>
              Build your own air quality monitoring device.
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
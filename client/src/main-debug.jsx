import React from 'react'
import ReactDOM from 'react-dom/client'

console.log('🔥 MAIN.JSX LOADING - Starting React app...')

const TestApp = () => {
  console.log('🚀 TestApp rendering...')
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>
        🌍 EcoKids India Debug Test
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center' }}>
        If you see this, React is working! ✅
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> React App Successfully Loaded</p>
        <button 
          onClick={() => {
            alert('Button works! 🎉')
            console.log('Button clicked successfully')
          }}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Test Button 🚀
        </button>
      </div>
    </div>
  );
};

console.log('📱 About to render TestApp...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)

console.log('✅ ReactDOM.render called successfully')
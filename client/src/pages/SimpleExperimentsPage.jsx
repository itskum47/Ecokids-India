import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const SimpleExperimentsPage = () => {
  console.log('SimpleExperimentsPage rendering...');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🧪 Environmental Experiments
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Page Working!</h2>
          <p className="text-gray-600 mb-4">
            This is a simplified experiments page to test if the routing and basic components are working.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simple experiment cards */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Water Quality Testing</h3>
              <p className="text-green-700 text-sm mb-4">
                Learn how to test water quality using simple household items.
              </p>
              <span className="inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                Beginner
              </span>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Air Quality Monitor</h3>
              <p className="text-blue-700 text-sm mb-4">
                Build your own air quality monitoring device.
              </p>
              <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
                Advanced
              </span>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Soil pH Testing</h3>
              <p className="text-purple-700 text-sm mb-4">
                Discover how to test soil acidity and alkalinity.
              </p>
              <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
                Intermediate
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleExperimentsPage;
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecokids', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`.green.bold);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`.red.bold);
    console.log('⚠️  Running in development mode without database connection'.yellow.bold);
    // Don't exit in development mode, allow the server to continue running
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
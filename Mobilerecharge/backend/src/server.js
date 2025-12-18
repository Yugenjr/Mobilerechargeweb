import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();
// Using port 5002

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3004', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RechargeX Backend API',
    version: '1.0.0',
    endpoints: {
      verifyFirebaseToken: 'POST /api/auth/verify-firebase-token',
      googleSignIn: 'POST /api/auth/google-signin',
      health: 'GET /health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'FIREBASE_PROJECT_ID'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Connect to MongoDB first
    await connectDB();
    
    // Then start listening
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🚀 RechargeX Backend Server Running     ║
║   📡 Port: ${PORT}                           ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}      ║
║   🔐 Firebase Auth: Enabled                ║
║   📱 Phone & Google Sign-In Ready          ║
║   💾 MongoDB: Connected                    ║
╚════════════════════════════════════════════╝
      `);
      console.log(`\n✅ Server is listening on http://localhost:${PORT}`);
      console.log(`📌 Press Ctrl+C to stop\n`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n👋 SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('🔒 HTTP server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n👋 SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('🔒 HTTP server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();

export default app;
 

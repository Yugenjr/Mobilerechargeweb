/**
 * Backend Keep-Alive Service
 * Pings backend every 10 minutes to prevent Render free tier sleep
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

let pingInterval = null;

export const startKeepAlive = () => {
  if (pingInterval) {
    console.log('⏰ Keep-alive already running');
    return;
  }

  console.log('🚀 Starting backend keep-alive service');
  
  // Ping immediately
  pingBackend();
  
  // Then ping every 10 minutes
  pingInterval = setInterval(pingBackend, PING_INTERVAL);
};

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('⏸️ Keep-alive service stopped');
  }
};

const pingBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('💚 Backend is alive');
    } else {
      console.warn('⚠️ Backend health check returned:', response.status);
    }
  } catch (error) {
    console.error('❌ Backend ping failed:', error.message);
  }
};

// Auto-start when module loads (only in production)
if (import.meta.env.PROD) {
  startKeepAlive();
}

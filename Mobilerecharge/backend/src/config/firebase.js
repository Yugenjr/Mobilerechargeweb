import admin from 'firebase-admin';

// Initialize Firebase Admin with project ID only (no service account needed for token verification)
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'event-horizon-9sr6w'
});

const auth = admin.auth();

export { auth };

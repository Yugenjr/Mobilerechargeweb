import express from 'express';
import { verifyFirebaseToken, verifyGoogleAuth, updateUserMobile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/verify-firebase-token
router.post('/verify-firebase-token', verifyFirebaseToken);

// POST /api/auth/google-signin
router.post('/google-signin', verifyGoogleAuth);

export default router;

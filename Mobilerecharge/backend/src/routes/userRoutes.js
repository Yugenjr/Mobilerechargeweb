import express from 'express';
import { updateUserMobile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/update-mobile - Update user mobile number (protected)
router.post('/update-mobile', authenticate, updateUserMobile);

export default router;

import express from 'express';
import { checkUser, onboardUser } from '../controllers/userController.js';

const router = express.Router();

// POST /api/auth/check-user - Check if user exists by Firebase UID
router.post('/check-user', checkUser);

// POST /api/onboarding - Onboard new user
router.post('/onboarding', onboardUser);

export default router;

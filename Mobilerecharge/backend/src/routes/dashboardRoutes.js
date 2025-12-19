import express from 'express';
import { getDashboardData, getDashboardDataByUid, getPlans, getPrimarySim, createRecharge } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/:uid - Get user dashboard data by UID (public)
router.get('/dashboard/:uid', getDashboardDataByUid);

// GET /api/dashboard - Get user dashboard data (protected - legacy)
router.get('/dashboard', authenticate, getDashboardData);

// GET /api/plans/:operator - Get plans by operator (protected)
router.get('/plans/:operator', authenticate, getPlans);

// GET /api/sims/primary - Get user's primary SIM (protected)
router.get('/sims/primary', authenticate, getPrimarySim);

// POST /api/payments/recharge - Create recharge (protected)
router.post('/payments/recharge', authenticate, createRecharge);

export default router;

import express from 'express';
import { seedPlans, getAllPlans, deleteAllPlans } from '../controllers/adminController.js';

const router = express.Router();

// Seed plans database
router.post('/seed-plans', seedPlans);

// Get all plans grouped by operator
router.get('/plans/all', getAllPlans);

// Delete all plans (for testing/reset)
router.delete('/plans/all', deleteAllPlans);

export default router;

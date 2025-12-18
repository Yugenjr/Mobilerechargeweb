import User from '../models/User.js';
import Sim from '../models/Sim.js';
import Plan from '../models/Plan.js';
import Payment from '../models/Payment.js';
import UsageStats from '../models/UsageStats.js';

/**
 * Get user dashboard data
 * GET /api/dashboard
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's SIMs
    const sims = await Sim.find({ userId, isActive: true });

    // Get primary SIM or first SIM
    const primarySim = sims.find(sim => sim.isPrimary) || sims[0];

    let currentPlan = null;
    let usageStats = null;

    if (primarySim) {
      // Get current plan for primary SIM
      const plans = await Plan.find({ simId: primarySim._id, isActive: true }).limit(1);
      currentPlan = plans[0];

      // Get usage stats for primary SIM
      usageStats = await UsageStats.findOne({ userId, simId: primarySim._id });
    }

    // Get recent payments
    const recentPayments = await Payment.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile || primarySim?.mobileNumber
        },
        sims: sims.map(sim => ({
          id: sim._id,
          mobileNumber: sim.mobileNumber,
          operator: sim.operator,
          isPrimary: sim.isPrimary
        })),
        currentPlan: currentPlan ? {
          name: currentPlan.name,
          price: currentPlan.price,
          validity: currentPlan.validity,
          benefits: currentPlan.benefits
        } : null,
        usage: usageStats ? {
          dataUsed: usageStats.dataUsed,
          dataTotal: usageStats.dataTotal,
          callsUsed: usageStats.callsUsed,
          smsUsed: usageStats.smsUsed
        } : {
          dataUsed: 0,
          dataTotal: 100,
          callsUsed: 0,
          smsUsed: 0
        },
        recentPayments: recentPayments.map(payment => ({
          id: payment._id,
          amount: payment.amount,
          date: payment.date,
          status: payment.status,
          rechargeType: payment.rechargeType,
          friendMobile: payment.friendMobile
        }))
      }
    });

  } catch (error) {
    console.error('❌ Dashboard Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};

/**
 * Get plans by operator
 * GET /api/plans/:operator
 */
export const getPlans = async (req, res) => {
  try {
    const { operator } = req.params;

    // Validate operator
    if (!['Jio', 'Airtel', 'Vi', 'BSNL'].includes(operator)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operator'
      });
    }

    const plans = await Plan.find({ operator, isActive: true }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      data: plans.map(plan => ({
        _id: plan._id,
        name: plan.name,
        price: plan.price,
        validity: plan.validity,
        benefits: plan.benefits,
        operator: plan.operator,
        popular: plan.popular,
        category: plan.category
      }))
    });

  } catch (error) {
    console.error('❌ Get Plans Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch plans'
    });
  }
};

/**
 * Get user's primary SIM
 * GET /api/sims/primary
 */
export const getPrimarySim = async (req, res) => {
  try {
    const userId = req.user.userId;

    const sims = await Sim.find({ userId, isActive: true });
    const primarySim = sims.find(sim => sim.isPrimary) || sims[0];

    if (!primarySim) {
      return res.status(404).json({
        success: false,
        message: 'No SIM found'
      });
    }

    res.status(200).json({
      success: true,
      sim: {
        id: primarySim._id,
        mobileNumber: primarySim.mobileNumber,
        operator: primarySim.operator,
        isPrimary: primarySim.isPrimary
      }
    });

  } catch (error) {
    console.error('❌ Get Primary SIM Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch SIM'
    });
  }
};

/**
 * Create recharge payment
 * POST /api/payments/recharge
 */
export const createRecharge = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { simId, amount, rechargeType, friendMobile } = req.body;

    if (rechargeType === 'self' && simId) {
      // Verify SIM belongs to user
      const sim = await Sim.findOne({ _id: simId, userId });
      if (!sim) {
        return res.status(404).json({
          success: false,
          message: 'SIM not found'
        });
      }
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      simId: rechargeType === 'self' ? simId : null,
      amount,
      rechargeType,
      friendMobile: rechargeType === 'friend' ? friendMobile : null,
      status: 'success',
      transactionId: 'TXN' + Date.now()
    });

    res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('❌ Create Recharge Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create recharge'
    });
  }
};

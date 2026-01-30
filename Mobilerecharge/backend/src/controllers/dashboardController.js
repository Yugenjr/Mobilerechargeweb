import User from '../models/User.js';
import Sim from '../models/Sim.js';
import Plan from '../models/Plan.js';
import Payment from '../models/Payment.js';
import UsageStats from '../models/UsageStats.js';

/**
 * Get user dashboard data by UID
 * GET /api/dashboard/:uid
 */
export const getDashboardDataByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    console.log('📊 Fetching dashboard for UID:', uid);

    // Get user by Firebase UID
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      console.error('❌ User not found for UID:', uid);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.email);

    // Get user's SIMs
    const sims = await Sim.find({ userId: user._id, isActive: true });
    console.log('📱 SIMs found:', sims.length);

    // Get primary SIM or first SIM
    const primarySim = sims.find(sim => sim.isPrimary) || sims[0];

    let currentPlan = null;
    let usageStats = null;

    if (primarySim) {
      // Get current plan for primary SIM
      const plans = await Plan.find({ simId: primarySim._id, isActive: true }).limit(1);
      currentPlan = plans[0];

      // Get usage stats for primary SIM
      usageStats = await UsageStats.findOne({ userId: user._id, simId: primarySim._id });
    }

    // Get recent payments
    const recentPayments = await Payment.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(5);

    console.log('✅ Dashboard data prepared successfully');

    res.status(200).json({
      success: true,
      data: {
        user: {
          uid: user.firebaseUid,
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
          status: payment.status
        }))
      }
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

/**
 * Get user dashboard data (legacy - JWT based)
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
      data: {
        _id: primarySim._id,
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
    const { simId, planId, amount, rechargeType, friendMobile } = req.body;

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

    // Verify plan exists
    if (planId) {
      const plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found'
        });
      }
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      simId: rechargeType === 'self' ? simId : null,
      planId,
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

/**
 * Seed plans into database
 * GET /api/seed-plans
 */
export const seedPlans = async (req, res) => {
  try {
    const plans = [
      // JIO PLANS
      // Popular
      { operator: 'Jio', name: 'Jio 239', price: 239, validity: '28 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 299', price: 299, validity: '28 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 666', price: 666, validity: '84 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 719', price: 719, validity: '84 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 2999', price: 2999, validity: '365 Days', benefits: { data: '2.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      // Data
      { operator: 'Jio', name: 'Jio 15', price: 15, validity: 'Active Plan', benefits: { data: '1 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Jio', name: 'Jio 25', price: 25, validity: 'Active Plan', benefits: { data: '2 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Jio', name: 'Jio 61', price: 61, validity: 'Active Plan', benefits: { data: '6 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Jio', name: 'Jio 121', price: 121, validity: 'Active Plan', benefits: { data: '12 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Jio', name: 'Jio 222', price: 222, validity: 'Active Plan', benefits: { data: '50 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      // Unlimited (True 5G)
      { operator: 'Jio', name: 'Jio 395', price: 395, validity: '84 Days', benefits: { data: '6 GB', calls: 'Unlimited', sms: '1000 Total' }, category: 'Unlimited', popular: false },
      { operator: 'Jio', name: 'Jio 1559', price: 1559, validity: '336 Days', benefits: { data: '24 GB', calls: 'Unlimited', sms: '3600 Total' }, category: 'Unlimited', popular: false },
      // Validity
      { operator: 'Jio', name: 'Jio 155', price: 155, validity: '28 Days', benefits: { data: '2 GB', calls: 'Unlimited', sms: '300 Total' }, category: 'Validity', popular: false },

      // AIRTEL PLANS
      // Popular
      { operator: 'Airtel', name: 'Airtel 239', price: 239, validity: '24 Days', benefits: { data: '1 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 299', price: 299, validity: '28 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 479', price: 479, validity: '56 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 719', price: 719, validity: '84 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 1799', price: 1799, validity: '365 Days', benefits: { data: '24 GB', calls: 'Unlimited', sms: '3600 Total' }, category: 'Popular', popular: false },
      // Data
      { operator: 'Airtel', name: 'Airtel 19', price: 19, validity: '1 Day', benefits: { data: '1 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Airtel', name: 'Airtel 58', price: 58, validity: 'Existing Plan', benefits: { data: '3 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Airtel', name: 'Airtel 148', price: 148, validity: 'Existing Plan', benefits: { data: '15 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      // Unlimited
      { operator: 'Airtel', name: 'Airtel 2999', price: 2999, validity: '365 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: true },
      // Validity
      { operator: 'Airtel', name: 'Airtel 99', price: 99, validity: '28 Days', benefits: { data: '200 MB', calls: 'Rs 99 Talktime', sms: 'NA' }, category: 'Validity', popular: false },

      // VI PLANS (Vodafone Idea)
      // Popular
      { operator: 'Vi', name: 'Vi 299', price: 299, validity: '28 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Vi', name: 'Vi 479', price: 479, validity: '56 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Vi', name: 'Vi 719', price: 719, validity: '84 Days', benefits: { data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      // Data
      { operator: 'Vi', name: 'Vi 19', price: 19, validity: '1 Day', benefits: { data: '1 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      { operator: 'Vi', name: 'Vi 39', price: 39, validity: 'Active Plan', benefits: { data: '3 GB', calls: 'NA', sms: 'NA' }, category: 'Data', popular: false },
      // Unlimited Hero
      { operator: 'Vi', name: 'Vi 2999', price: 2999, validity: '365 Days', benefits: { data: '850 GB', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: false },

      // BSNL PLANS
      // Popular
      { operator: 'BSNL', name: 'BSNL 153', price: 153, validity: '26 Days', benefits: { data: '1 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'BSNL', name: 'BSNL 199', price: 199, validity: '30 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'BSNL', name: 'BSNL 397', price: 397, validity: '150 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'BSNL', name: 'BSNL 1999', price: 1999, validity: '365 Days', benefits: { data: '600 GB', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      // Validity
      { operator: 'BSNL', name: 'BSNL 107', price: 107, validity: '35 Days', benefits: { data: '3 GB', calls: '200 Min', sms: 'NA' }, category: 'Validity', popular: false },
      { operator: 'BSNL', name: 'BSNL 197', price: 197, validity: '70 Days', benefits: { data: '2 GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: false }
    ];

    await Plan.deleteMany({});
    await Plan.insertMany(plans);

    console.log(`✅ Seeded ${plans.length} plans successfully`);
    res.status(200).json({
      success: true,
      message: `Seeded ${plans.length} plans`,
      count: plans.length
    });

  } catch (error) {
    console.error('❌ Seed plans error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

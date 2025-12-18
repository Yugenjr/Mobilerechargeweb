import Plan from '../models/Plan.js';

/**
 * Seed Database with Mobile Recharge Plans
 * POST /api/admin/seed-plans
 */
export const seedPlans = async (req, res) => {
  try {
    // Check if plans already exist
    const existingPlans = await Plan.countDocuments();
    if (existingPlans > 0) {
      return res.status(200).json({
        success: true,
        message: `Plans already exist in database (${existingPlans} plans found)`,
        count: existingPlans
      });
    }

    const plansData = [
      // Jio Plans
      { operator: 'Jio', name: 'Jio 2GB/day - 28 days', price: 239, validity: '28 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 2.5GB/day - 28 days', price: 299, validity: '28 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Jio', name: 'Jio 3GB/day - 28 days', price: 399, validity: '28 days', benefits: { data: '3GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Data', popular: false },
      { operator: 'Jio', name: 'Jio 2GB/day - 84 days', price: 666, validity: '84 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: false },
      { operator: 'Jio', name: 'Jio 2.5GB/day - 84 days', price: 719, validity: '84 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: true },
      { operator: 'Jio', name: 'Jio 3GB/day - 84 days', price: 999, validity: '84 days', benefits: { data: '3GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: false },

      // Airtel Plans
      { operator: 'Airtel', name: 'Airtel 2GB/day - 28 days', price: 299, validity: '28 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 2.5GB/day - 28 days', price: 359, validity: '28 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Airtel', name: 'Airtel 3GB/day - 28 days', price: 449, validity: '28 days', benefits: { data: '3GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Data', popular: false },
      { operator: 'Airtel', name: 'Airtel 2GB/day - 84 days', price: 699, validity: '84 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: false },
      { operator: 'Airtel', name: 'Airtel 2.5GB/day - 84 days', price: 779, validity: '84 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: true },
      { operator: 'Airtel', name: 'Airtel 2GB/day - 1 year', price: 1799, validity: '365 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: false },

      // Vi (Vodafone Idea) Plans
      { operator: 'Vi', name: 'Vi 2GB/day - 28 days', price: 269, validity: '28 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Vi', name: 'Vi 2.5GB/day - 28 days', price: 329, validity: '28 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'Vi', name: 'Vi 3GB/day - 28 days', price: 409, validity: '28 days', benefits: { data: '3GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Data', popular: false },
      { operator: 'Vi', name: 'Vi 2GB/day - 84 days', price: 669, validity: '84 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: false },
      { operator: 'Vi', name: 'Vi 2.5GB/day - 84 days', price: 749, validity: '84 days', benefits: { data: '2.5GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: true },
      { operator: 'Vi', name: 'Vi 2GB/day - 1 year', price: 1799, validity: '365 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: false },

      // BSNL Plans
      { operator: 'BSNL', name: 'BSNL 2GB/day - 26 days', price: 107, validity: '26 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'BSNL', name: 'BSNL 2GB/day - 28 days', price: 187, validity: '28 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Popular', popular: true },
      { operator: 'BSNL', name: 'BSNL 2GB/day - 45 days', price: 297, validity: '45 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Data', popular: false },
      { operator: 'BSNL', name: 'BSNL 2GB/day - 60 days', price: 397, validity: '60 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: false },
      { operator: 'BSNL', name: 'BSNL 2GB/day - 180 days', price: 797, validity: '180 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Validity', popular: true },
      { operator: 'BSNL', name: 'BSNL 2GB/day - 1 year', price: 1498, validity: '365 days', benefits: { data: '2GB/day', calls: 'Unlimited', sms: '100/day' }, category: 'Unlimited', popular: false },
    ];

    // Insert all plans
    const insertedPlans = await Plan.insertMany(plansData);
    
    console.log('✅ Successfully seeded plans database');
    
    res.status(201).json({
      success: true,
      message: 'Plans database seeded successfully',
      count: insertedPlans.length,
      plans: insertedPlans
    });

  } catch (error) {
    console.error('❌ Seed plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed plans',
      error: error.message
    });
  }
};

/**
 * Get all plans grouped by operator
 * GET /api/admin/plans/all
 */
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ operator: 1, price: 1 });
    
    // Group by operator
    const groupedPlans = plans.reduce((acc, plan) => {
      if (!acc[plan.operator]) {
        acc[plan.operator] = [];
      }
      acc[plan.operator].push(plan);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: plans.length,
      plans: groupedPlans
    });

  } catch (error) {
    console.error('❌ Get all plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
      error: error.message
    });
  }
};

/**
 * Delete all plans (for testing/reset)
 * DELETE /api/admin/plans/all
 */
export const deleteAllPlans = async (req, res) => {
  try {
    const result = await Plan.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: 'All plans deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Delete plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete plans',
      error: error.message
    });
  }
};

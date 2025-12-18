/**
 * Seed Database with Mobile Recharge Plans
 * Run: node src/scripts/seedPlans.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.js';

dotenv.config();

const plans = [
  // JIO PLANS
  {
    operator: 'Jio',
    name: 'Basic',
    price: 155,
    validity: '28 Days',
    benefits: {
      data: '1GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Jio',
    name: 'Popular',
    price: 239,
    validity: '28 Days',
    benefits: {
      data: '1.5GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: true
  },
  {
    operator: 'Jio',
    name: 'Premium',
    price: 299,
    validity: '28 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Jio',
    name: 'Long Term',
    price: 666,
    validity: '84 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Jio',
    name: 'Annual Pack',
    price: 2999,
    validity: '365 Days',
    benefits: {
      data: '2.5GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },

  // AIRTEL PLANS
  {
    operator: 'Airtel',
    name: 'Smart Recharge',
    price: 179,
    validity: '28 Days',
    benefits: {
      data: '1GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Airtel',
    name: 'Popular Choice',
    price: 265,
    validity: '28 Days',
    benefits: {
      data: '1.5GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: true
  },
  {
    operator: 'Airtel',
    name: 'Unlimited',
    price: 299,
    validity: '28 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Airtel',
    name: 'Value Pack',
    price: 719,
    validity: '84 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Airtel',
    name: 'Yearly',
    price: 3359,
    validity: '365 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },

  // VI (VODAFONE IDEA) PLANS
  {
    operator: 'Vi',
    name: 'Starter',
    price: 149,
    validity: '24 Days',
    benefits: {
      data: '1GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Vi',
    name: 'Popular',
    price: 269,
    validity: '28 Days',
    benefits: {
      data: '1.5GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: true
  },
  {
    operator: 'Vi',
    name: 'Power Pack',
    price: 299,
    validity: '28 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'Vi',
    name: 'Long Validity',
    price: 839,
    validity: '84 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },

  // BSNL PLANS
  {
    operator: 'BSNL',
    name: 'Economy',
    price: 107,
    validity: '26 Days',
    benefits: {
      data: '1GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'BSNL',
    name: 'Standard',
    price: 187,
    validity: '28 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: true
  },
  {
    operator: 'BSNL',
    name: 'Premium',
    price: 397,
    validity: '70 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  },
  {
    operator: 'BSNL',
    name: 'Annual Value',
    price: 2399,
    validity: '365 Days',
    benefits: {
      data: '2GB/Day',
      calls: 'Unlimited',
      sms: '100/Day'
    },
    popular: false
  }
];

async function seedPlans() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('🧹 Cleared existing plans');

    // Insert new plans
    const insertedPlans = await Plan.insertMany(plans);
    console.log(`✅ Inserted ${insertedPlans.length} plans`);

    // Display summary
    const operators = [...new Set(plans.map(p => p.operator))];
    for (const operator of operators) {
      const count = plans.filter(p => p.operator === operator).length;
      console.log(`   📱 ${operator}: ${count} plans`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedPlans();

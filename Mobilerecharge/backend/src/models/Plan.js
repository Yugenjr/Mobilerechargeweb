import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true,
    enum: ['Jio', 'Airtel', 'Vi', 'BSNL'],
    index: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  validity: {
    type: String,
    required: true
  },
  benefits: {
    data: String,
    calls: String,
    sms: String
  },
  popular: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Popular', 'Data', 'Unlimited', 'Validity'],
    default: 'Popular'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Plan = mongoose.model('Plan', planSchema);
export default Plan;

import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  simId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sim',
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

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  simId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sim'
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  amount: {
    type: Number,
    required: true
  },
  rechargeType: {
    type: String,
    enum: ['self', 'friend'],
    required: true
  },
  friendMobile: {
    type: String,
    match: /^[0-9]{10}$/
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  },
  transactionId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

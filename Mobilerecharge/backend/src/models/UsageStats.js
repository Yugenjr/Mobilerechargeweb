import mongoose from 'mongoose';

const usageStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  simId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sim',
    required: true
  },
  dataUsed: {
    type: Number,
    default: 0
  },
  dataTotal: {
    type: Number,
    default: 100
  },
  callsUsed: {
    type: Number,
    default: 0
  },
  smsUsed: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UsageStats = mongoose.model('UsageStats', usageStatsSchema);
export default UsageStats;

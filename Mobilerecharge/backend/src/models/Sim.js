import mongoose from 'mongoose';

const simSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  operator: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
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

const Sim = mongoose.model('Sim', simSchema);
export default Sim;

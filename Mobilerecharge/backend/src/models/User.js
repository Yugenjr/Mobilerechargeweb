import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    trim: true,
    match: /^[0-9]{10}$/,
    sparse: true // Allow multiple null values
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true // Allow multiple null values
  },
  name: {
    type: String,
    trim: true
  },
  firebaseUid: {
    type: String,
    trim: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure at least one identifier exists
userSchema.pre('save', function(next) {
  if (!this.mobile && !this.email) {
    next(new Error('User must have either mobile or email'));
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

export default User;

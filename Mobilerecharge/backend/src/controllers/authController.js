import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../config/firebase.js';

/**
 * Verify Google Sign In Firebase token
 * POST /api/auth/google-signin
 * @param {string} firebaseToken - Firebase ID token from Google Sign In
 * @param {string} email - User's email
 * @param {string} name - User's display name
 * @param {string} uid - Firebase UID
 */
export const verifyGoogleAuth = async (req, res) => {
  try {
    const { firebaseToken, email, name, uid } = req.body;

    // Validate inputs
    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token is required'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(firebaseToken);
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase token'
      });
    }

    console.log(`✅ Firebase token verified for Google Sign In: ${decodedToken.email}`);

    // Verify UID matches
    if (decodedToken.uid !== uid) {
      return res.status(400).json({
        success: false,
        message: 'UID mismatch'
      });
    }

    // Find or create user by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with email
      user = await User.create({ 
        email,
        name,
        firebaseUid: uid
      });
      console.log(`✅ New Google user created: ${email}`);
    } else {
      // Update existing user info if needed
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
      }
      if (!user.name && name) {
        user.name = name;
      }
      await user.save();
      console.log(`✅ Existing Google user logged in: ${email}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '30d' }
    );

    // Return success response
    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error('❌ Google Sign In Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sign in with Google. Please try again.'
    });
  }
};

/**
 * Update user mobile number
 * POST /api/users/update-mobile
 * @param {string} mobile - 10 digit mobile number
 */
export const updateUserMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    const userId = req.user.userId; // From JWT middleware

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.mobile = mobile;
    await user.save();

    // Create primary SIM for the user
    const Sim = (await import('../models/Sim.js')).default;
    const existingSim = await Sim.findOne({ userId: user._id });
    
    if (!existingSim) {
      await Sim.create({
        userId: user._id,
        mobileNumber: mobile,
        operator: 'Unknown',
        isPrimary: true
      });
      console.log(`✅ Primary SIM created for user: ${mobile}`);
    }

    console.log(`✅ User mobile updated: ${user.email} -> ${mobile}`);

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error('❌ Update Mobile Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update mobile number'
    });
  }
};

/**
 * Verify Firebase ID Token and create/login user
 * POST /api/auth/verify-firebase-token
 * @param {string} firebaseToken - Firebase ID token
 * @param {string} mobile - 10 digit mobile number
 */
export const verifyFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken, mobile } = req.body;

    // Validate inputs
    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase token is required'
      });
    }

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number'
      });
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(firebaseToken);
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase token'
      });
    }

    console.log(`✅ Firebase token verified for UID: ${decodedToken.uid}`);

    // Extract phone number from Firebase token
    const phoneNumber = decodedToken.phone_number;
    
    if (!phoneNumber || !phoneNumber.endsWith(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number mismatch'
      });
    }

    // Create or get user
    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile });
      console.log(`✅ New user created: ${mobile}`);
    } else {
      console.log(`✅ Existing user logged in: ${mobile}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        mobile: user.mobile 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '30d' }
    );

    // Return success response matching frontend contract
    res.status(200).json({
      success: true,
      token,
      user: {
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error('❌ Verify OTP Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP. Please try again.'
    });
  }
};

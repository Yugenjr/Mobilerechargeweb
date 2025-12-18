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

    // Detect operator from mobile number
    const detectOperator = (mobileNumber) => {
      const prefix = parseInt(mobileNumber.substring(0, 4));
      const jioPrefixes = [6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009, 8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009];
      const airtelPrefixes = [6200, 6201, 6290, 7300, 7301, 7302, 7303, 7400, 7401, 7402, 8100, 8101, 8102, 8103, 8104, 8400, 8401, 8402, 8403, 8404, 9100, 9101, 9102, 9103, 9104, 9300, 9301, 9302, 9303, 9304];
      const viPrefixes = [6300, 6301, 6302, 6303, 7500, 7501, 7502, 7503, 7600, 7601, 8200, 8201, 8202, 8203, 8500, 8501, 8502, 8503, 8600, 8601, 9200, 9201, 9202, 9203, 9500, 9501, 9502, 9503, 9600, 9601];
      const bsnlPrefixes = [6100, 6101, 6102, 6103, 7700, 7701, 7702, 7703, 7800, 7801, 8300, 8301, 8302, 8303, 8700, 8701, 8702, 8703, 8800, 8801, 9400, 9401, 9402, 9403, 9700, 9701, 9702, 9703, 9800, 9801];
      
      if (jioPrefixes.includes(prefix)) return 'Jio';
      if (airtelPrefixes.includes(prefix)) return 'Airtel';
      if (viPrefixes.includes(prefix)) return 'Vi';
      if (bsnlPrefixes.includes(prefix)) return 'BSNL';
      return 'Jio'; // Default to Jio
    };

    // Create primary SIM for the user
    const Sim = (await import('../models/Sim.js')).default;
    const existingSim = await Sim.findOne({ userId: user._id });
    
    if (!existingSim) {
      const operator = detectOperator(mobile);
      await Sim.create({
        userId: user._id,
        mobileNumber: mobile,
        operator,
        isPrimary: true
      });
      console.log(`✅ Primary SIM created for user: ${mobile} (${operator})`);
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

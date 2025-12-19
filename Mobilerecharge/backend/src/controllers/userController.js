import User from '../models/User.js';

/**
 * Check if user exists by Firebase UID
 * POST /api/auth/check-user
 */
export const checkUser = async (req, res) => {
  try {
    const { uid, email, name } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID is required'
      });
    }

    console.log('🔍 Checking user:', uid);

    // Check if user exists by Firebase UID
    const user = await User.findOne({ firebaseUid: uid });

    if (user) {
      console.log('✅ Existing user found:', user.email);
      return res.status(200).json({
        success: true,
        isNewUser: false,
        user: {
          uid: user.firebaseUid,
          email: user.email,
          name: user.name,
          mobile: user.mobile
        }
      });
    } else {
      console.log('🆕 New user detected:', email);
      return res.status(200).json({
        success: true,
        isNewUser: true,
        userData: {
          uid,
          email,
          name
        }
      });
    }
  } catch (error) {
    console.error('❌ Check user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user'
    });
  }
};

/**
 * Onboard new user
 * POST /api/onboarding
 */
export const onboardUser = async (req, res) => {
  try {
    const { uid, email, name, mobileNumber } = req.body;

    if (!uid || !email || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'UID, email, and mobile number are required'
      });
    }

    console.log('📱 Onboarding user:', { uid, email, mobileNumber });

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid: uid });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Detect operator from mobile number
    const detectOperator = (mobile) => {
      const prefix = parseInt(mobile.substring(0, 4));
      const jioPrefixes = [6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009, 8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009];
      const airtelPrefixes = [6200, 6201, 6290, 7300, 7301, 7302, 7303, 7400, 7401, 7402, 8100, 8101, 8102, 8103, 8104, 8400, 8401, 8402, 8403, 8404, 9100, 9101, 9102, 9103, 9104, 9300, 9301, 9302, 9303, 9304];
      const viPrefixes = [6300, 6301, 6302, 6303, 7500, 7501, 7502, 7503, 7600, 7601, 8200, 8201, 8202, 8203, 8500, 8501, 8502, 8503, 8600, 8601, 9200, 9201, 9202, 9203, 9500, 9501, 9502, 9503, 9600, 9601];
      const bsnlPrefixes = [6100, 6101, 6102, 6103, 7700, 7701, 7702, 7703, 7800, 7801, 8300, 8301, 8302, 8303, 8700, 8701, 8702, 8703, 8800, 8801, 9400, 9401, 9402, 9403, 9700, 9701, 9702, 9703, 9800, 9801];
      
      if (jioPrefixes.includes(prefix)) return 'Jio';
      if (airtelPrefixes.includes(prefix)) return 'Airtel';
      if (viPrefixes.includes(prefix)) return 'Vi';
      if (bsnlPrefixes.includes(prefix)) return 'BSNL';
      return 'Jio'; // Default
    };

    // Create user
    const user = await User.create({
      firebaseUid: uid,
      email,
      name,
      mobile: mobileNumber
    });

    // Create SIM for user
    const Sim = (await import('../models/Sim.js')).default;
    const operator = detectOperator(mobileNumber);
    
    await Sim.create({
      userId: user._id,
      mobileNumber,
      operator,
      isPrimary: true
    });

    console.log('✅ User onboarded successfully:', email);

    res.status(201).json({
      success: true,
      message: 'User onboarded successfully',
      user: {
        uid: user.firebaseUid,
        email: user.email,
        name: user.name,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error('❌ Onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to onboard user'
    });
  }
};

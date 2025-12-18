/**
 * Firebase Authentication Handlers
 * Clean, modular functions for Google Sign-In and Phone OTP
 */

import {
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

// ==================== GOOGLE SIGN-IN ====================

/**
 * Sign in with Google using popup
 * @returns {Promise<User>} Firebase user object
 */
export const signInWithGoogle = async () => {
  try {
    console.log('🔐 signInWithGoogle() - START');
    console.log('📋 Auth instance:', auth);
    console.log('📋 Google provider:', googleProvider);
    console.log('🪟 About to call signInWithPopup...');
    
    const result = await signInWithPopup(auth, googleProvider);
    
    console.log('✅ Google Sign-In successful!');
    console.log('📧 User email:', result.user.email);
    console.log('👤 User display name:', result.user.displayName);
    return result.user;
  } catch (error) {
    console.error('❌ Google Sign-In failed:', error.code, error.message);
    
    // Throw user-friendly errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked. Please allow popups for this site.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('Domain not authorized. Please contact support.');
    }
    throw error;
  }
};

// ==================== PHONE OTP ====================

let recaptchaVerifier = null;

/**
 * Initialize reCAPTCHA verifier (call once)
 * @param {string} containerId - ID of the reCAPTCHA container div
 */
export const initRecaptcha = (containerId = 'recaptcha-container') => {
  if (recaptchaVerifier) {
    console.log('♻️ Reusing existing reCAPTCHA verifier');
    return recaptchaVerifier;
  }

  console.log('🔧 Initializing reCAPTCHA verifier...');
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('✅ reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.error('⏰ reCAPTCHA expired');
    }
  });

  return recaptchaVerifier;
};

/**
 * Clear reCAPTCHA verifier
 */
export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
    console.log('🧹 reCAPTCHA verifier cleared');
  }
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
 * @returns {Promise<ConfirmationResult>} Confirmation result for OTP verification
 */
export const sendOTP = async (phoneNumber) => {
  try {
    console.log('📱 Sending OTP to:', phoneNumber);
    
    // Ensure reCAPTCHA is initialized
    const appVerifier = recaptchaVerifier || initRecaptcha();
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log('✅ OTP sent successfully');
    return confirmationResult;
  } catch (error) {
    console.error('❌ Failed to send OTP:', error.code, error.message);
    
    // Clear and reinitialize reCAPTCHA on error
    clearRecaptcha();
    initRecaptcha();
    
    // Throw user-friendly errors
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.');
    }
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {ConfirmationResult} confirmationResult - Result from sendOTP
 * @param {string} code - 6-digit OTP code
 * @returns {Promise<UserCredential>} User credential
 */
export const verifyOTP = async (confirmationResult, code) => {
  try {
    console.log('🔐 Verifying OTP...');
    const result = await confirmationResult.confirm(code);
    console.log('✅ OTP verified successfully');
    return result;
  } catch (error) {
    console.error('❌ OTP verification failed:', error.code, error.message);
    
    // Throw user-friendly errors
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid OTP. Please check and try again.');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('OTP expired. Please request a new one.');
    }
    throw error;
  }
};

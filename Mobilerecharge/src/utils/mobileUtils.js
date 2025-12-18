/**
 * Detect operator from mobile number
 * Based on common Indian mobile number series
 */
export const detectOperator = (mobileNumber) => {
  if (!mobileNumber || mobileNumber.length < 4) {
    return 'Unknown';
  }

  const prefix = mobileNumber.substring(0, 4);
  const prefixNum = parseInt(prefix);

  // Jio prefixes
  const jioPrefixes = [
    6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009,
    7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009,
    8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009,
    9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009
  ];

  // Airtel prefixes
  const airtelPrefixes = [
    6200, 6201, 6290, 7300, 7301, 7302, 7303, 7400, 7401, 7402,
    8100, 8101, 8102, 8103, 8104, 8400, 8401, 8402, 8403, 8404,
    9100, 9101, 9102, 9103, 9104, 9300, 9301, 9302, 9303, 9304
  ];

  // Vi (Vodafone Idea) prefixes
  const viPrefixes = [
    6300, 6301, 6302, 6303, 7500, 7501, 7502, 7503, 7600, 7601,
    8200, 8201, 8202, 8203, 8500, 8501, 8502, 8503, 8600, 8601,
    9200, 9201, 9202, 9203, 9500, 9501, 9502, 9503, 9600, 9601
  ];

  // BSNL prefixes
  const bsnlPrefixes = [
    6100, 6101, 6102, 6103, 7700, 7701, 7702, 7703, 7800, 7801,
    8300, 8301, 8302, 8303, 8700, 8701, 8702, 8703, 8800, 8801,
    9400, 9401, 9402, 9403, 9700, 9701, 9702, 9703, 9800, 9801
  ];

  if (jioPrefixes.includes(prefixNum)) {
    return 'Jio';
  } else if (airtelPrefixes.includes(prefixNum)) {
    return 'Airtel';
  } else if (viPrefixes.includes(prefixNum)) {
    return 'Vi';
  } else if (bsnlPrefixes.includes(prefixNum)) {
    return 'BSNL';
  }

  return 'Unknown';
};

/**
 * Format mobile number with country code
 */
export const formatMobileNumber = (mobile) => {
  if (!mobile) return '';
  return mobile.startsWith('+91') ? mobile : `+91${mobile}`;
};

/**
 * Validate mobile number (10 digits)
 */
export const isValidMobile = (mobile) => {
  return /^[6-9][0-9]{9}$/.test(mobile);
};

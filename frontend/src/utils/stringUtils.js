/**
 * Utility functions for string handling and UTF-8 validation
 */

/**
 * Validates and sanitizes a string to ensure it's valid UTF-8
 * @param {string} str - The string to validate
 * @param {string} [fallback=''] - Fallback value if the string is invalid
 * @returns {string} - The validated/sanitized string
 */
export const validateUTF8 = (str, fallback = '') => {
  if (str === null || str === undefined) return fallback;
  
  try {
    const encoded = encodeURIComponent(str);
    return decodeURIComponent(encoded);
  } catch (e) {
    console.error('Invalid UTF-8 string:', str, e);
    // Remove non-ASCII characters as a fallback
    return str.replace(/[^\x00-\x7F]/g, '') || fallback;
  }
};

/**
 * Validates an object's string properties recursively
 * @param {Object} obj - The object to validate
 * @returns {Object} - A new object with validated strings
 */
export const validateObjectStrings = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = validateUTF8(value);
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => 
        typeof item === 'string' ? validateUTF8(item) : validateObjectStrings(item)
      );
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = validateObjectStrings(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

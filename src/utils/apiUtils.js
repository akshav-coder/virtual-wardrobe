import { API_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../config/api";

/**
 * Handle API errors and return user-friendly messages
 * @param {Object} error - The error object from RTK Query
 * @param {string} defaultMessage - Default error message
 * @returns {string} User-friendly error message
 */
export const handleApiError = (
  error,
  defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR
) => {
  if (!error) return defaultMessage;

  // Network error
  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // HTTP status errors
  switch (error.status) {
    case 400:
      return error.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return error.data?.message || defaultMessage;
  }
};

/**
 * Show success message
 * @param {string} message - Success message
 * @param {Function} showAlert - Alert function (from react-native)
 */
export const showSuccessMessage = (message, showAlert) => {
  if (showAlert) {
    showAlert("Success", message);
  }
};

/**
 * Show error message
 * @param {Object} error - Error object
 * @param {Function} showAlert - Alert function (from react-native)
 * @param {string} defaultMessage - Default error message
 */
export const showErrorMessage = (error, showAlert, defaultMessage) => {
  if (showAlert) {
    const message = handleApiError(error, defaultMessage);
    showAlert("Error", message);
  }
};

/**
 * Format API response data
 * @param {Object} response - API response
 * @returns {Object} Formatted data
 */
export const formatApiResponse = (response) => {
  if (!response) return null;

  // Handle different response structures
  if (response.data) {
    return response.data;
  }

  return response;
};

/**
 * Build query parameters object
 * @param {Object} params - Parameters object
 * @returns {Object} Filtered parameters
 */
export const buildQueryParams = (params) => {
  const filteredParams = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      filteredParams[key] = value;
    }
  });

  return filteredParams;
};

/**
 * Create FormData for file uploads
 * @param {Object} data - Data object
 * @param {File|Object} file - File to upload
 * @param {string} fileFieldName - Field name for the file
 * @returns {FormData} FormData object
 */
export const createFormData = (data, file, fileFieldName = "image") => {
  const formData = new FormData();

  // Add file
  if (file) {
    formData.append(fileFieldName, {
      uri: file.uri || file.path,
      type: file.type || "image/jpeg",
      name: file.name || "image.jpg",
    });
  }

  // Add other data
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  return formData;
};

/**
 * Validate file before upload
 * @param {Object} file - File object
 * @returns {Object} Validation result
 */
export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size && file.size > API_CONFIG.UPLOAD.maxFileSize) {
    errors.push(
      `File size must be less than ${
        API_CONFIG.UPLOAD.maxFileSize / (1024 * 1024)
      }MB`
    );
  }

  // Check file type
  if (file.type && !API_CONFIG.UPLOAD.allowedTypes.includes(file.type)) {
    errors.push(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Retry function for failed API calls
 * @param {Function} apiCall - API call function
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries
 * @returns {Promise} Promise that resolves with the result
 */
export const retryApiCall = async (
  apiCall,
  maxRetries = API_CONFIG.RETRY.attempts,
  delay = API_CONFIG.RETRY.delay
) => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403
      ) {
        throw error;
      }

      // Wait before retrying (except on last attempt)
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

/**
 * Get cache key for API query
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
export const getCacheKey = (endpoint, params = {}) => {
  const paramString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return paramString ? `${endpoint}?${paramString}` : endpoint;
};

/**
 * Check if data is stale based on timestamp
 * @param {Date|string} timestamp - Data timestamp
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {boolean} True if data is stale
 */
export const isDataStale = (timestamp, maxAge) => {
  if (!timestamp) return true;

  const dataTime = new Date(timestamp).getTime();
  const now = Date.now();

  return now - dataTime > maxAge;
};

/**
 * Format error for logging
 * @param {Object} error - Error object
 * @param {string} context - Error context
 * @returns {Object} Formatted error for logging
 */
export const formatErrorForLogging = (error, context = "API Call") => {
  return {
    context,
    message: error.message || "Unknown error",
    status: error.status,
    data: error.data,
    timestamp: new Date().toISOString(),
  };
};

export default {
  handleApiError,
  showSuccessMessage,
  showErrorMessage,
  formatApiResponse,
  buildQueryParams,
  createFormData,
  validateFile,
  debounce,
  retryApiCall,
  getCacheKey,
  isDataStale,
  formatErrorForLogging,
};

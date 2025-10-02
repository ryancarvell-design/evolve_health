/**
 * Authentication utility functions
 * Handles login, logout, and authentication state management
 */

import { supabase } from '../lib/supabase';

// Add this block - Define AUTH_KEYS constant
const AUTH_KEYS = {
  IS_AUTHENTICATED: 'isAuthenticated',
  USER_EMAIL: 'userEmail',
  USER_DATA: 'userData',
  SESSION_TIMESTAMP: 'sessionTimestamp',
  LAST_ACTIVITY: 'lastActivity',
  PREFERENCES: 'preferences'
};

// Add this block - Define MOCK_USERS constant
const MOCK_USERS = {
  'admin@example.com': {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'IT'
  },
  'user@example.com': {
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    department: 'Operations'
  }
};

/**
 * Check if user is currently authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase?.auth?.getSession()

    if (error) {
      console.error('Error getting auth session:', error)
      return false
    }

    return !!data?.session?.user
  } catch (error) {
    console.error('Error checking authentication status:', error)
    return false
  }
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userEmail = localStorage.getItem(AUTH_KEYS?.USER_EMAIL);
    const userData = localStorage.getItem(AUTH_KEYS?.USER_DATA);
    
    return {
      email: userEmail,
      data: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Set authentication state after successful login
 * @param {Object} userData - User data to store
 */
export const setAuthState = (userData) => {
  try {
    localStorage.setItem(AUTH_KEYS?.IS_AUTHENTICATED, 'true');
    localStorage.setItem(AUTH_KEYS?.USER_EMAIL, userData?.email || '');
    localStorage.setItem(AUTH_KEYS?.SESSION_TIMESTAMP, new Date()?.toISOString());
    localStorage.setItem(AUTH_KEYS?.LAST_ACTIVITY, new Date()?.toISOString());
    
    // Store complete user data including name, role, department etc.
    if (userData) {
      const { password, ...userDataWithoutPassword } = userData;
      localStorage.setItem(AUTH_KEYS?.USER_DATA, JSON.stringify(userDataWithoutPassword));
    }
  } catch (error) {
    console.error('Error setting authentication state:', error);
  }
};

/**
 * Clear all authentication and user data from localStorage
 * @param {boolean} preservePreferences - Whether to keep user preferences
 */
export const clearAuthState = (preservePreferences = false) => {
  try {
    const preferences = preservePreferences ? localStorage.getItem(AUTH_KEYS?.PREFERENCES) : null;
    
    // Clear authentication-related data
    Object.values(AUTH_KEYS)?.forEach(key => {
      if (!(preservePreferences && key === AUTH_KEYS?.PREFERENCES)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear any other session data that might exist
    const sessionKeys = [
      'notifications',
      'dashboardSettings',
      'documentFilters',
      'recentDocuments',
      'activeWorkspace'
    ];
    
    sessionKeys?.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Restore preferences if requested
    if (preservePreferences && preferences) {
      localStorage.setItem(AUTH_KEYS?.PREFERENCES, preferences);
    }
    
    console.log('Authentication state cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication state:', error);
  }
};

/**
 * Perform complete logout with cleanup
 * @param {boolean} preservePreferences - Whether to keep user preferences
 * @returns {Promise<boolean>} Success status
 */
export const performLogout = async (preservePreferences = false) => {
  try {
    // Add any API logout calls here in the future
    // await api.logout();
    
    // Clear local storage
    clearAuthState(preservePreferences);
    
    // Clear any other app-specific cleanup
    // Clear Redux store if using Redux
    // Clear any cached data
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

/**
 * Update last activity timestamp
 * Used for session management and timeout detection
 */
export const updateLastActivity = async () => {
  try {
    const authenticated = await isAuthenticated()
    if (authenticated) {
      localStorage.setItem(AUTH_KEYS?.LAST_ACTIVITY, new Date()?.toISOString());
    }
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
};

/**
 * Check if session has expired based on inactivity
 * @param {number} timeoutMinutes - Session timeout in minutes (default: 480 = 8 hours)
 * @returns {boolean} Whether session has expired
 */
export const isSessionExpired = async (timeoutMinutes = 480) => {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) return true;

    const lastActivity = localStorage.getItem(AUTH_KEYS?.LAST_ACTIVITY);
    if (!lastActivity) return true;

    const lastActivityTime = new Date(lastActivity)?.getTime();
    const currentTime = new Date()?.getTime();
    const timeDifference = currentTime - lastActivityTime;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    return timeDifference > timeoutMs;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return true;
  }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User data if authentication successful, null otherwise
 */
export const authenticateUser = (email, password) => {
  try {
    const user = MOCK_USERS?.[email?.toLowerCase()];
    
    if (user && user?.password === password) {
      // Return user data without password for security
      const { password: _, ...userDataWithoutPassword } = user;
      return userDataWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

/**
 * Get all registered users (admin function)
 * @returns {Array} Array of users without passwords
 */
export const getAllUsers = () => {
  try {
    return Object.values(MOCK_USERS)?.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

/**
 * Check if a user exists by email
 * @param {string} email - User email to check
 * @returns {boolean} Whether user exists
 */
export const userExists = (email) => {
  try {
    return !!MOCK_USERS?.[email?.toLowerCase()];
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

export default {
  isAuthenticated,
  getCurrentUser,
  setAuthState,
  clearAuthState,
  performLogout,
  updateLastActivity,
  isSessionExpired,
  authenticateUser,
  getAllUsers,
  userExists
};
/**
 * OAuth Configuration Helper
 * 
 * This file provides configuration for OAuth services.
 * For Google OAuth, the frontend application must use the exact redirect URI
 * that was registered in the Google Cloud Console.
 */

// The base URL of the application (for redirect URIs)
export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

// Google OAuth configuration
export const googleOAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '', // Add this property
  handleOAuthError: (error: unknown): string => {
    console.error('OAuth Error:', error);
    return typeof error === 'string' ? error : 'Authentication failed';
  }
};

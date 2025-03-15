import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Define the available features that can be checked
export type FeatureType = 'scan' | 'export' | 'apiCall';

export const useFeatureAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const { trackUsage } = useSubscription();
  const [usageCount, setUsageCount] = useState<number>(
    parseInt(localStorage.getItem('guestPredictionCount') || '0')
  );
  const navigate = useNavigate();

  // Check if user can access a feature
  const canAccessFeature = useCallback(
    (feature: FeatureType): boolean => {
      // Admin can access everything
      if (user?.role === 'admin') return true;

      // Pro users have unlimited access
      if (user?.role === 'pro') return true;

      // For scan feature, authenticated users can scan based on subscription level
      // Free users get a limited number per month
      if (feature === 'scan') {
        // Authenticated basic users get more scans than guests
        if (isAuthenticated) {
          // Check if monthly limit is reached (for non-pro users)
          return user?.usageStats?.scanThisMonth < 5;
        } 
        // Unauthenticated users get exactly one scan
        return usageCount < 1;
      }

      // Export and API access are Pro-only features
      return false;
    },
    [user, isAuthenticated, usageCount]
  );

  // Record feature usage
  const recordUsage = useCallback(
    async (feature: FeatureType): Promise<boolean> => {
      try {
        if (isAuthenticated) {
          // For authenticated users, track through the API
          await trackUsage(feature);
          return true;
        } else {
          // For guests, track locally for the scan feature
          if (feature === 'scan') {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            localStorage.setItem('guestPredictionCount', newCount.toString());
            return true;
          }
          return false;
        }
      } catch (error) {
        console.error(`Failed to record ${feature} usage:`, error);
        return false;
      }
    },
    [isAuthenticated, trackUsage, usageCount]
  );

  // Check access and handle rejection if needed
  const checkFeatureAccess = useCallback(
    async (feature: FeatureType): Promise<boolean> => {
      const hasAccess = canAccessFeature(feature);

      if (!hasAccess) {
        if (!isAuthenticated) {
          toast({
            title: "Access Limited",
            description: "Create an account to unlock more plant scans.",
            action: {
              label: "Sign Up",
              onClick: () => navigate("/signup"),
            },
          });
        } else {
          toast({
            title: "Feature Locked",
            description: "Upgrade to Pro for unlimited scans and more features.",
            action: {
              label: "Upgrade",
              onClick: () => navigate("/SubToPro"),
            },
          });
        }
        return false;
      }

      // Record usage if access is granted
      return await recordUsage(feature);
    },
    [canAccessFeature, recordUsage, isAuthenticated, navigate]
  );

  // Reset guest usage count (used for testing)
  const resetGuestUsage = useCallback(() => {
    localStorage.removeItem('guestPredictionCount');
    setUsageCount(0);
  }, []);

  return {
    canAccessFeature,
    checkFeatureAccess,
    resetGuestUsage,
    usageCount
  };
};

import { useState, useCallback } from 'react';
import { subscriptionService } from '@/services/subscriptionService';
import { SubscriptionDetails, SubscriptionPlan, OrderResponse, PaymentVerificationData } from '@/types/subscription';
import { useAuth } from '@/context/AuthContext';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get subscription plans
  const getPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionService.getPlans();
      return data;
    } catch (err) {
      setError('Failed to fetch subscription plans');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create subscription order
  const createOrder = useCallback(async (plan: string, couponCode?: string): Promise<OrderResponse> => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionService.createOrder(plan, couponCode);
      return data;
    } catch (err) {
      setError('Failed to create subscription order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Razorpay payment
  const initializePayment = useCallback(async (
    orderData: OrderResponse,
    onSuccess: (data: PaymentVerificationData) => void
  ) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: "LeafCare Pro",
      description: "Subscription Payment",
      order_id: orderData.orderId,
      handler: function (response: any) {
        const verificationData: PaymentVerificationData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          plan: orderData.amount === 999 ? 'monthly' : 'annual'
        };
        onSuccess(verificationData);
      },
      prefill: {
        name: user?.firstName,
        email: user?.email
      },
      theme: {
        color: "#22c55e"
      }
    };

    const razorpayWindow = new (window as any).Razorpay(options);
    razorpayWindow.open();
  }, [user]);

  // Verify payment after Razorpay checkout completes
  const verifyPayment = useCallback(async (data: PaymentVerificationData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Sending payment verification data:", data);
      const result = await subscriptionService.verifyPayment(data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify payment';
      console.error("Payment verification error:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's subscription
  const getUserSubscription = useCallback(async (): Promise<SubscriptionDetails> => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionService.getUserSubscription();
      return data.subscription;
    } catch (err) {
      setError('Failed to fetch subscription details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await subscriptionService.cancelSubscription();
    } catch (err) {
      setError('Failed to cancel subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Track feature usage
  const trackUsage = useCallback(async (feature: 'scan' | 'export' | 'apiCall') => {
    try {
      await subscriptionService.trackUsage(feature);
    } catch (err) {
      console.error('Failed to track feature usage:', err);
    }
  }, []);

  return {
    loading,
    error,
    getPlans,
    createOrder,
    initializePayment,
    verifyPayment,
    getUserSubscription,
    cancelSubscription,
    trackUsage
  };
};

export default useSubscription;

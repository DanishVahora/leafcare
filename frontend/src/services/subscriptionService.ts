import api from './api';
import { OrderResponse, PaymentVerificationData } from '@/types/subscription';

export const subscriptionService = {
  // Get subscription plans
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  // Create subscription order
  createOrder: async (plan: string, couponCode?: string): Promise<OrderResponse> => {
    try {
      const response = await api.post('/subscriptions/create-order', {
        plan,
        couponCode,
        receipt: `s_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`
      });
      return response.data;
    } catch (error) {
      const razorpayError = error?.response?.data as RazorpayError;
      if (razorpayError?.code === 'BAD_REQUEST_ERROR') {
        const subscriptionError = new Error(razorpayError.description) as SubscriptionError;
        subscriptionError.code = razorpayError.code;
        subscriptionError.statusCode = error?.response?.status;
        throw subscriptionError;
      }
      throw new Error('Failed to create subscription order');
    }
  },

  // Verify payment
  verifyPayment: async (data: PaymentVerificationData) => {
    const response = await api.post('/subscriptions/verify-payment', data);
    return response.data;
  },

  // Get user subscription details
  getUserSubscription: async () => {
    const response = await api.get('/subscriptions/user-subscription');
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },

  // Track feature usage
  trackUsage: async (feature: 'scan' | 'export' | 'apiCall') => {
    const response = await api.post('/subscriptions/track-usage', { feature });
    return response.data;
  }
};

export default subscriptionService;

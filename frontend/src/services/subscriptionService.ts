import api from './api';
import { SubscriptionPlan, SubscriptionDetails, PaymentVerificationData } from '@/types/subscription';

export const subscriptionService = {
  // Get subscription plans
  getPlans: async () => {
    const response = await api.get<{ plans: SubscriptionPlan[], benefits: any[] }>('/subscriptions/plans');
    return response.data;
  },

  // Create subscription order
  createOrder: async (plan: string, couponCode?: string) => {
    const response = await api.post('/subscriptions/create-order', { plan, couponCode });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (data: PaymentVerificationData) => {
    console.log("Verifying payment with data:", data);
    const response = await api.post('/subscriptions/verify-payment', data);
    return response.data;
  },

  // Get user's subscription details
  getUserSubscription: async () => {
    const response = await api.get<{ subscription: SubscriptionDetails }>('/subscriptions/my-subscription');
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
  },

  // Admin: Get all subscriptions
  getAllSubscriptions: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/subscriptions/admin/all', { params });
    return response.data;
  }
};

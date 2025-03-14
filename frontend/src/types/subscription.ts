export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  savings?: string;
}

export interface PaymentDetails {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  receipt: string;
  couponUsed: string | null;
  discountApplied: boolean;
}

export interface SubscriptionFeatures {
  unlimitedScans: boolean;
  advancedAnalytics: boolean;
  dataExport: boolean;
  historicalData: boolean;
  premiumSupport: boolean;
  apiAccess: boolean;
}

export interface SubscriptionDetails {
  id: string;
  status: 'active' | 'canceled' | 'expired';
  plan: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  features: {
    unlimitedScans: boolean;
    advancedAnalytics: boolean;
    dataExport: boolean;
    historicalData: boolean;
    premiumSupport: boolean;
    apiAccess: boolean;
  };
  isActive: boolean;
  paymentDetails?: PaymentDetails;
  usageStats?: {
    totalScans: number;
    scanThisMonth: number;
    lastScanDate: string | null;
    exportsCount: number;
    apiCallsCount: number;
  };
}

export interface PaymentVerificationData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  plan: string;
  couponCode?: string;
}

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  discountApplied: boolean;
}

export interface SubscriptionBenefit {
  title: string;
  description: string;
  featureKey: string;
}

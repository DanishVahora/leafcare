export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
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
  features: SubscriptionFeatures;
  isActive: boolean;
  paymentDetails?: PaymentDetails;
}

export interface PaymentVerificationData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  plan: 'monthly' | 'annual';
  couponCode?: string;
}

export interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  discountApplied: boolean;
}

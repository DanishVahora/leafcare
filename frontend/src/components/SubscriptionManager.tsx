import React, { useEffect, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { loadRazorpayScript } from '@/lib/razorpay';
import { SubscriptionPlan, PaymentVerificationData } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

export const SubscriptionManager = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { loading, error, getPlans, createOrder, initializePayment } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { plans } = await getPlans();
        setPlans(plans);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch subscription plans",
          variant: "destructive"
        });
      }
    };

    fetchPlans();
  }, [getPlans]);

  const handleSubscribe = async (plan: string) => {
    try {
      // Load Razorpay script
      await loadRazorpayScript();
      
      // Create order
      const orderData = await createOrder(plan);
      
      // Initialize payment
      await initializePayment(orderData, async (paymentData: PaymentVerificationData) => {
        try {
          // Handle successful payment
          toast({
            title: "Success",
            description: "Subscription activated successfully!",
          });
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to verify payment",
            variant: "destructive"
          });
        }
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="p-6 border rounded-lg">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="text-gray-600">{plan.description}</p>
          <div className="mt-4">
            <span className="text-2xl font-bold">₹{plan.price}</span>
            {plan.savings && (
              <span className="ml-2 text-green-600 text-sm">{plan.savings}</span>
            )}
          </div>
          <Button
            onClick={() => handleSubscribe(plan.id)}
            className="mt-4 w-full"
          >
            Subscribe
          </Button>
        </div>
      ))}
    </div>
  );
};

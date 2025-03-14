import React, { useEffect, useState } from 'react';
import { SubscriptionDetails } from '@/types/subscription';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const { getUserSubscription, loading, error, cancelSubscription } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subData = await getUserSubscription();
        setSubscription(subData);
      } catch (err) {
        // Subscription might not exist
        console.log('No active subscription found');
      }
    };

    fetchSubscription();
  }, [getUserSubscription]);

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      try {
        await cancelSubscription();
        // Refresh subscription data
        const subData = await getUserSubscription();
        setSubscription(subData);
      } catch (err) {
        console.error('Failed to cancel subscription:', err);
      }
    }
  };

  if (loading) return <div className="p-4">Loading subscription status...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Upgrade to LeafCare Pro to access premium features.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/subscribe')}>Get Pro</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subscription Status</CardTitle>
          <Badge variant={subscription.status === 'active' ? 'success' : 'outline'}>
            {subscription.status === 'active' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" /> Active
              </>
            ) : subscription.status === 'canceled' ? (
              <>
                <Clock className="w-4 h-4 mr-1" /> Canceled
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" /> Expired
              </>
            )}
          </Badge>
        </div>
        <CardDescription>
          {subscription.plan === 'monthly' ? 'Monthly' : 'Annual'} Plan
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Start Date:</span>
            <span className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {format(new Date(subscription.startDate), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Renewal Date:</span>
            <span className="font-medium flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {format(new Date(subscription.endDate), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Features Included:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(subscription.features).map(([key, value]) => 
                value && (
                  <li key={key} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {key.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {subscription.status === 'active' && (
          <Button 
            variant="outline"
            onClick={handleCancelSubscription}
          >
            Cancel Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

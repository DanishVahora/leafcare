import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UpgradePromptProps {
  feature: 'scan' | 'export' | 'apiCall';
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const featureText = {
    scan: 'unlimited plant scans',
    export: 'data exporting capabilities',
    apiCall: 'API access'
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-yellow-200">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-yellow-100 rounded-full">
          <Lock className="h-6 w-6 text-amber-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-amber-800">
          {isAuthenticated ? 'Upgrade to Pro' : 'Create an Account'}
        </h3>
        
        <p className="text-amber-700">
          {isAuthenticated
            ? `Upgrade to LeafCare Pro to unlock ${featureText[feature]} and many more premium features.`
            : `Create a free account to get more plant scans and unlock additional features.`}
        </p>
        
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Button 
              onClick={() => navigate('/SubToPro')}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/signup')}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Create Account
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

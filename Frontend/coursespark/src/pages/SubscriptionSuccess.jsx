
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { verifyStripeSession } from "@/api/functions";

export default function SubscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your subscription...');

  useEffect(() => {
    const verifySubscription = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      const checkoutStatus = params.get('checkout');
      
      // Check if checkout was successful
      if (checkoutStatus !== 'success' || !sessionId) {
        setStatus('error');
        setMessage('Subscription verification failed. No session ID found.');
        return;
      }

      try {
        // Call backend to verify the subscription session
        const response = await verifyStripeSession({ sessionId });

        if (response.data.ok) {
          setStatus('success');
          setMessage('Welcome to Course Spark Premium! Redirecting to home...');
          
          // Wait 2 seconds then redirect to home
          setTimeout(() => {
            navigate(createPageUrl('Homepage'));
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.data.reason || 'Subscription verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Failed to verify subscription. Please contact support.');
      }
    };

    verifySubscription();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Status Icon */}
            {status === 'verifying' && (
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
            )}
            {status === 'success' && (
              <div className="relative">
                <Crown className="w-16 h-16 text-amber-500" />
                <CheckCircle className="w-8 h-8 text-emerald-500 absolute -bottom-1 -right-1" />
              </div>
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}

            {/* Status Message */}
            <div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                {status === 'verifying' && 'Activating Premium'}
                {status === 'success' && '🎉 You\'re Premium!'}
                {status === 'error' && 'Subscription Issue'}
              </h2>
              <p className="text-slate-600">{message}</p>
            </div>

            {/* Premium Features */}
            {status === 'success' && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 w-full">
                <p className="text-sm font-semibold text-purple-900 mb-2">
                  Premium Features Unlocked:
                </p>
                <ul className="text-xs text-purple-800 space-y-1 text-left">
                  <li>✨ AI Tutor Access</li>
                  <li>🛠️ Advanced AI Tools</li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            {status === 'error' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Homepage'))}
                  className="flex-1"
                >
                  Go to Home
                </Button>
                <Button
                  onClick={() => window.location.href = 'mailto:support@coursespark.com'}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Contact Support
                </Button>
              </div>
            )}

            {status === 'success' && (
              <p className="text-sm text-slate-500">
                Taking you home in a moment...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

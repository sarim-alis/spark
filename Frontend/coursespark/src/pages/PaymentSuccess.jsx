
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { verifyCourseCheckout } from "@/api/functions";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      const purchaseStatus = params.get('purchase');
      
      // Check if payment was successful
      if (purchaseStatus !== 'success' || !sessionId) {
        setStatus('error');
        setMessage('Payment verification failed. No session ID found.');
        return;
      }

      try {
        // Call backend to verify the checkout session
        const response = await verifyCourseCheckout({ sessionId });

        if (response.data.ok) {
          setStatus('success');
          setMessage('Payment successful! Taking you to your course...');
          
          // Wait 2 seconds then redirect to the specific course purchased
          setTimeout(() => {
            navigate(`/courseviewer/${response.data.courseId}`);
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.data.reason || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Status Icon */}
            {status === 'verifying' && (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}

            {/* Status Message */}
            <div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                {status === 'verifying' && 'Verifying Payment'}
                {status === 'success' && 'Payment Successful!'}
                {status === 'error' && 'Payment Issue'}
              </h2>
              <p className="text-slate-600">{message}</p>
            </div>

            {/* Action Buttons */}
            {status === 'error' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Marketplace'))}
                  className="flex-1"
                >
                  Back to Marketplace
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
                Taking you to your course in a moment...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { createCourseCheckout } from "@/api/functions";

export default function PaymentModal({ course, isOpen, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Get the current URL origin for redirect URLs
      const currentOrigin = window.location.origin;
      
      // Call backend to create Stripe checkout session
      const response = await createCourseCheckout({
        courseId: course.id,
        // Redirect to a dedicated payment success page (using kebab-case for route name)
        successUrlBase: `${currentOrigin}/payment-success`,
        // Redirect to the homepage after cancellation
        cancelUrlBase: `${currentOrigin}/`
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            Secure Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Course Summary */}
          <Card className="border-0 bg-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'} 
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                  <p className="text-slate-600 text-xs">{course.instructor_name || 'Course Creator'}</p>
                </div>
                <Badge className="bg-purple-500 text-white">${course.price || 0}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Info about Stripe */}
          <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
            <p className="text-sm text-blue-800">
              You'll be redirected to Stripe's secure checkout page to complete your payment.
            </p>
          </div>

          {/* Payment Button */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ${course.price || 0}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            🔒 Secured by Stripe. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

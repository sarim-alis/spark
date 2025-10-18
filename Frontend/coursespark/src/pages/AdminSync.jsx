import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle, XCircle, Users, ShoppingBag } from 'lucide-react';
import { syncStripeSubscriptions, syncCoursePurchases } from '@/api/functions';

export default function AdminSync() {
  const [subscriptionResults, setSubscriptionResults] = useState(null);
  const [purchaseResults, setPurchaseResults] = useState(null);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [error, setError] = useState(null);

  const syncSubscriptions = async () => {
    setIsLoadingSubscriptions(true);
    setError(null);
    setSubscriptionResults(null);

    try {
      const response = await syncStripeSubscriptions();
      setSubscriptionResults(response);
    } catch (err) {
      setError(`Subscription sync failed: ${err.message}`);
    }
    setIsLoadingSubscriptions(false);
  };

  const syncPurchases = async () => {
    setIsLoadingPurchases(true);
    setError(null);
    setPurchaseResults(null);

    try {
      const response = await syncCoursePurchases();
      setPurchaseResults(response);
    } catch (err) {
      setError(`Purchase sync failed: ${err.message}`);
    }
    setIsLoadingPurchases(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Sync Panel</h1>
          <p className="text-slate-600">Sync existing Stripe payments with user accounts</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Subscription Sync */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Sync Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Sync active Stripe subscriptions and unlock premium features for existing paid users.
              </p>

              <Button
                onClick={syncSubscriptions}
                disabled={isLoadingSubscriptions}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isLoadingSubscriptions ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Subscriptions
                  </>
                )}
              </Button>

              {subscriptionResults && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Found:</span>
                    <span className="font-semibold">{subscriptionResults.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Updated:</span>
                    <span className="font-semibold text-emerald-600">
                      {subscriptionResults.updated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Not Found:</span>
                    <span className="font-semibold text-amber-600">
                      {subscriptionResults.notFound}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Errors:</span>
                    <span className="font-semibold text-red-600">
                      {subscriptionResults.errors.length}
                    </span>
                  </div>

                  {subscriptionResults.details.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs text-slate-500 cursor-pointer">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-48">
                        {JSON.stringify(subscriptionResults.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Purchase Sync */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                Sync Course Purchases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Sync completed course purchases from the last 30 days and create enrollment records.
              </p>

              <Button
                onClick={syncPurchases}
                disabled={isLoadingPurchases}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                {isLoadingPurchases ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Purchases
                  </>
                )}
              </Button>

              {purchaseResults && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Sessions:</span>
                    <span className="font-semibold">{purchaseResults.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Created:</span>
                    <span className="font-semibold text-emerald-600">
                      {purchaseResults.created}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Already Existed:</span>
                    <span className="font-semibold text-blue-600">
                      {purchaseResults.alreadyExists}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Skipped:</span>
                    <span className="font-semibold text-amber-600">
                      {purchaseResults.skipped}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Errors:</span>
                    <span className="font-semibold text-red-600">
                      {purchaseResults.errors.length}
                    </span>
                  </div>

                  {purchaseResults.details.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs text-slate-500 cursor-pointer">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-48">
                        {JSON.stringify(purchaseResults.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
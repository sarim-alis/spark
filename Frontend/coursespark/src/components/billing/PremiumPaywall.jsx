
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Lock, Bot, Wand2 } from "lucide-react"; // Added Bot, Wand2 imports
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom"; // Added useNavigate import

export default function PremiumPaywall({ feature }) { // Changed prop from featureName to feature
  const navigate = useNavigate(); // Added navigate hook

  const [isUpgrading, setIsUpgrading] = React.useState(false);
  const [user, setUser] = React.useState(null);

  // Added features object
  const features = {
    'AI Tutor': {
      icon: Bot,
      title: 'AI Tutor',
      description: 'Get instant help with any topic from your personal AI tutor',
      benefits: [
        '24/7 availability',
        'Personalized explanations',
        'Interactive learning',
        'Unlimited questions'
      ]
    },
    'AI Tools': {
      icon: Wand2,
      title: 'AI Tools',
      description: 'Generate study notes and professional resumes with AI',
      benefits: [
        'Smart notes generator',
        'Resume builder',
        'Professional templates',
        'Instant generation'
      ]
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const u = await User.me();
        setUser(u);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      await User.login();
      return;
    }
    setIsUpgrading(true);
    // Mock upgrade (no real billing on this platform)
    const now = new Date();
    const renew = new Date();
    renew.setMonth(renew.getMonth() + 1);
    await User.updateMyUserData({
      subscription: {
        plan: "premium",
        status: "active",
        started_at: now.toISOString(),
        renews_at: renew.toISOString(),
      },
    });
    window.location.reload();
  };

  // Determine the current feature details based on the 'feature' prop
  const currentFeature = features[feature] || {
    icon: Crown, // Default icon if feature not found
    title: feature || "this feature", // Use feature prop as title if not found in map, or default "this feature"
    description: "Unlock powerful capabilities with Premium.", // Default description
    benefits: [ // Default benefits if feature not found or no benefits specified
      "Exclusive premium access",
      "Ad-free experience",
      "Early access to new features"
    ]
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            {currentFeature.icon && <currentFeature.icon className="w-6 h-6 text-white" />}
          </div>
          <CardTitle className="text-2xl font-extrabold mt-3">
            Go Premium to access {currentFeature.title}
          </CardTitle>
          {currentFeature.description && (
            <p className="text-slate-600 mt-1">{currentFeature.description}</p>
          )}
          <p className="text-slate-600 mt-1">Only $5.99/month. Cancel anytime.</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {currentFeature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {benefit}
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Plan</div>
                  <div className="font-semibold">Premium</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-slate-900">$5.99</div>
                  <div className="text-xs text-slate-500">per month</div>
                </div>
              </div>
              <Button onClick={handleUpgrade} className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500" disabled={isUpgrading}>
                <Crown className="w-4 h-4 mr-2" />
                {user ? (isUpgrading ? "Upgrading..." : "Upgrade to Premium") : "Sign in to Upgrade"}
              </Button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Secure billing coming soon. This is a demo upgrade within the app.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Lock className="w-4 h-4" />
            Access to this section is limited to Premium users.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

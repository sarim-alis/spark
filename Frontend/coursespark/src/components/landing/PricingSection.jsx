import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { User as UserEntity } from '@/api/entities';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For creators just getting started.',
    features: ['Unlimited Courses', 'AI Course Generator', 'Your Own Storefront', 'Student Management'],
    cta: 'Start for Free',
    primary: true,
  },
  {
    name: 'Pro',
    price: '$29',
    price_period: '/ month',
    description: 'For professionals ready to scale.',
    features: ['Everything in Starter', 'Priority Support', 'Custom Branding', 'Advanced Customization'],
    cta: 'Go Pro',
    primary: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and large organizations.',
    features: ['Everything in Pro', 'Team Accounts', 'API Access', 'Dedicated Account Manager', 'Custom Integrations'],
    cta: 'Contact Sales',
    primary: false,
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-amber-600">Simple, Transparent Pricing</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose the Plan That's Right for You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Start for free and scale as you grow. No hidden fees, ever.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col border-2 ${tier.primary ? 'border-amber-500 shadow-2xl' : 'border-slate-200 shadow-lg'}`}>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-semibold text-slate-800">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                  {tier.price_period && <span className="text-base font-medium text-slate-500">{tier.price_period}</span>}
                </div>
                <CardDescription className="mt-2 text-sm">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  onClick={() => UserEntity.login()}
                  className={`w-full ${tier.primary ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}`}
                  variant={tier.primary ? 'default' : 'outline'}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
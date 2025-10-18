import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Store, UserCheck, Settings } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI Course Generator',
    description: 'Describe your course idea, and our AI will generate a complete curriculum, lessons, and even a thumbnail for you.',
    color: 'amber'
  },
  {
    icon: Store,
    title: 'Your Own Storefront',
    description: 'Get a beautiful, customizable storefront to sell your courses. No marketplace fees, complete control.',
    color: 'blue'
  },
  {
    icon: UserCheck,
    title: 'Seamless Student Management',
    description: 'Manage enrollments, communicate with students, and see their progress all in one place.',
    color: 'purple'
  },
  {
    icon: Settings,
    title: 'Easy Customization',
    description: 'Easily edit your course content, pricing, and details with our intuitive course editor. No code required.',
    color: 'pink'
  }
];

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  const colors = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
  }
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/50">
      <CardHeader>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[feature.color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
        <p className="text-slate-600 text-sm">{feature.description}</p>
      </CardContent>
    </Card>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-amber-600">Everything you need</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A Powerful Platform for Modern Creators
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            From creation to conversion, Course Spark provides all the tools you need to build a thriving online education business.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
             <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
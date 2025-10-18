import React from 'react';
import { Button } from '@/components/ui/button';
import { User as UserEntity } from '@/api/entities';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-white">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_10%,transparent)]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span className="font-semibold text-slate-700">AI-Powered Course Creation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
          Turn Your Knowledge Into Income
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
          Create, launch, and scale beautiful online courses with the power of AI. No coding, no hassle—just your expertise, brilliantly packaged.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            onClick={() => UserEntity.login()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5"
          >
            Start Creating for Free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Features
          </Button>
        </div>
        <p className="mt-4 text-sm text-slate-500">No credit card required. Start building your dream course today.</p>
        
        <div className="mt-16">
          <div className="relative max-w-5xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="A team collaborating on a project"
              className="rounded-2xl shadow-2xl border-4 border-white"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
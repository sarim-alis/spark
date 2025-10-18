import React from 'react';
import { Button } from '@/components/ui/button';
import { User as UserEntity } from '@/api/entities';
import { Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Ready to Share Your Genius?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-amber-100">
            Join thousands of creators who are turning their passion into a profession. Your audience is waiting.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => UserEntity.login()}
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold shadow-lg text-base"
            >
              Start Building Your Course
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { User as UserEntity } from '@/api/entities';
import { Sparkles, BookOpen } from 'lucide-react';

const Logo = () => (
  <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
    <div className="relative">
      <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
    </div>
    <h2 className="font-bold text-lg text-slate-800 tracking-tight">Course Spark</h2>
  </Link>
);

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex gap-4">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">FAQ</a>
            </nav>
            <Button variant="ghost" size="sm" onClick={() => UserEntity.login()}>Sign In</Button>
            <Button 
              size="sm"
              onClick={() => UserEntity.login()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
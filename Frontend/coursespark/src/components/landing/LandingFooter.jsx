import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles } from 'lucide-react';

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

export default function LandingFooter() {
  const links = {
    'Product': ['Features', 'Pricing', 'Updates', 'FAQ'],
    'Company': ['About', 'Careers', 'Contact'],
    'Resources': ['Blog', 'Help Center', 'Community'],
    'Legal': ['Privacy Policy', 'Terms of Service']
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-600">The AI-powered platform for course creators.</p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">{title}</h3>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-500 text-center">&copy; {new Date().getFullYear()} Course Spark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
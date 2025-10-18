import React from 'react';

const logos = [
  { name: 'Stripe', logo: () => <svg className="h-8 w-auto text-slate-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M43.989 8.011c-6.17-6.17-16.12-6.17-22.29 0L8.01 21.7c-6.17 6.17-6.17 16.12 0 22.29 6.17 6.17 16.12 6.17 22.29 0l13.69-13.69c6.17-6.17 6.17-16.12-.001-22.29zM19.16 35.84c-3.66-3.66-3.66-9.58 0-13.24l13.24-13.24c3.66-3.66 9.58-3.66 13.24 0 3.66 3.66 3.66 9.58 0 13.24L32.4 35.84c-3.66 3.66-9.58 3.66-13.24 0z" fill="currentColor"/></svg> },
  { name: 'Notion', logo: () => <svg className="h-8 w-auto text-slate-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6v36M12 14v20M36 14v20M12 14h24v20H12z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: 'Webflow', logo: () => <svg className="h-8 w-auto text-slate-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12h24v8H12zM28 20h8v16h-8zM12 20h8v16h-8zM12 36h24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: 'Vercel', logo: () => <svg className="h-8 w-auto text-slate-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6l18 36H6L24 6z" fill="currentColor"/></svg> },
  { name: 'Zapier', logo: () => <svg className="h-8 w-auto text-slate-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 24h36M18 12l-12 12 12 12M30 12l12 12-12 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

export default function SocialProof() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-600 tracking-wider">
          Trusted by over 10,000 creators at world-class companies
        </p>
        <div className="mt-6 flex justify-center flex-wrap gap-x-8 gap-y-4">
          {logos.map((company) => (
            <div key={company.name} className="flex items-center">
              <company.logo />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
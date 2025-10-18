
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User as UserEntity } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Sparkles, 
  Wand2, 
  Bot, 
  FileText, 
  Award, 
  Store, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

export default function Homepage() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleGetStartedClick = () => {
    const stripeLink = 'https://buy.stripe.com/5kQdR83PeglF5vEaCLaMU01'; // Updated Stripe link
    console.log('Opening Stripe link:', stripeLink);
    // Modified line to ensure link opens outside of any potential iframe
    window.top.location.href = stripeLink;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <BrandLogo withText size="lg" />
            <div className="flex items-center gap-3">
              {user ? (
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => UserEntity.login()}>Sign In</Button>
                  <Button onClick={handleGetStartedClick} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Get Started Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Create, Learn, and Grow with
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> AI Magic</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            CourseSpark empowers educators and learners with AI-driven tools to create courses, generate study materials, build resumes, and get personalized tutoring—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                  Open Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={handleGetStartedClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Start Free Today <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>

          <p className="text-sm text-slate-500 mt-4">No credit card required • Get started in 30 seconds</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything You Need to Succeed</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From course creation to career advancement, CourseSpark is your all-in-one learning companion.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Wand2}
              title="AI Course Creator"
              description="Generate complete courses with lessons, quizzes, and thumbnails in minutes. Just describe your topic!"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={Bot}
              title="AI Learning Assistant"
              description="Get instant help with any topic. Your personal tutor is available 24/7 to answer questions and explain concepts."
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard
              icon={FileText}
              title="Notes Generator"
              description="Transform any topic into comprehensive study notes. Perfect for exam prep and quick reviews."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={Award}
              title="Resume Builder"
              description="Create professional resumes with AI assistance. Stand out to employers with optimized formatting and content."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={Store}
              title="Personal Storefront"
              description="Sell your courses with a beautiful, customizable storefront. Keep 100% of your revenue."
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={BookOpen}
              title="Course Library"
              description="Access all your enrolled courses in one place. Track progress and continue learning anytime."
              gradient="from-pink-500 to-rose-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-8">
            <StepCard
              number="1"
              title="Sign Up Free"
              description="Create your account in seconds. No credit card required."
              icon={Zap}
            />
            <StepCard
              number="2"
              title="Choose Your Path"
              description="Create courses, generate notes, build your resume, or browse the marketplace."
              icon={Sparkles}
            />
            <StepCard
              number="3"
              title="Let AI Do the Heavy Lifting"
              description="Our AI tools generate professional content instantly. Edit and customize to your needs."
              icon={Wand2}
            />
            <StepCard
              number="4"
              title="Share & Earn"
              description="Publish your courses, share your storefront, and start earning from your expertise."
              icon={Store}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of creators and learners already using CourseSpark
          </p>
          {user ? (
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-xl">
                Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              onClick={handleGetStartedClick}
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-xl"
            >
              Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <BrandLogo withText size="md" textLight />
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} CourseSpark. Empowering learners with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description, icon: Icon }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

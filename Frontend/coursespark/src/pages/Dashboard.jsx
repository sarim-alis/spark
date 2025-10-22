
import React, { useState, useEffect, useCallback } from "react";
import { User, Course, Enrollment } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PlusCircle } from "lucide-react";

// Dashboard Components
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentCourses from "../components/dashboard/RecentCourses";
import QuickActions from "../components/dashboard/QuickActions";

// Landing Page Components
import LandingHeader from "../components/landing/LandingHeader";
import HeroSection from "../components/landing/HeroSection";
import SocialProof from "../components/landing/SocialProof";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

function LoggedInDashboard({ user }) {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Ensure user.email is available before making the call
      if (!user?.email) {
        console.warn("User email not available, skipping dashboard data load.");
        setIsLoading(false);
        return;
      }
      const courses = await Course.filter({ created_by: user.email }, '-created_date', 10);
      setRecentCourses(courses);

      const allEnrollments = await Enrollment.list();
      const myCourseIds = courses.map(c => c.id);
      const myEnrollments = allEnrollments.filter(e => myCourseIds.includes(e.course_id));
      
      const totalRevenue = courses.reduce((sum, c) => sum + (c.total_sales || 0), 0);
      const totalStudents = courses.reduce((sum, c) => sum + (c.total_students || 0), 0);
      
      const coursesWithRatings = courses.filter(c => (c.rating || 0) > 0);
      const avgRating = coursesWithRatings.length > 0
        ? coursesWithRatings.reduce((sum, c) => sum + (c.rating || 0), 0) / coursesWithRatings.length
        : 0;

      setStats({
        totalCourses: courses.length,
        totalStudents: totalStudents,
        totalRevenue: totalRevenue,
        avgRating: avgRating,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  }, [user?.email]); // user.email is a dependency

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); // loadDashboardData is a dependency

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Creator'}! 👋
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Ready to create something amazing today?
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Link to={createPageUrl("CourseCreator")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 py-2.5 text-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <DashboardStats stats={stats} isLoading={isLoading} />
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <RecentCourses courses={recentCourses} isLoading={isLoading} />
        </div>
        <div className="order-1 lg:order-2">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default function Dashboard() {
  console.log('Dashboard component rendering...');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Attempting to load user...');
        const userData = await User.me();
        console.log('User loaded:', userData);
        setUser(userData);
      } catch (error) {
        console.log('User not logged in:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="ml-4">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-yellow-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Welcome to CourseSpark!</h1>
          <p className="mb-6 text-gray-600">Please log in to access your dashboard.</p>
          <button 
            onClick={() => User.login()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mb-1">
              Welcome back, {user.full_name?.split(' ')[0] || 'Creator'}! 👋
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Ready to create something amazing today?
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Link to={createPageUrl("CourseCreator")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 py-2.5 text-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-2">Total Courses</h3>
          <p className="text-2xl font-bold text-slate-900">2</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-2">Total Students</h3>
          <p className="text-2xl font-bold text-slate-900">85</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-slate-900">$5,700</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-2">Avg Rating</h3>
          <p className="text-2xl font-bold text-slate-900">4.65</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Courses</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-800">Introduction to React</h3>
              <p className="text-sm text-slate-600">50 students • $2,500 revenue</p>
            </div>
            <span className="text-amber-500 font-semibold">4.5 ⭐</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-800">Advanced JavaScript</h3>
              <p className="text-sm text-slate-600">35 students • $3,200 revenue</p>
            </div>
            <span className="text-amber-500 font-semibold">4.8 ⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}

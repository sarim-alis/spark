
import React, { useState, useEffect, useCallback } from "react";
import { User, Course, Enrollment } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PlusCircle, BookOpen, Star, Sparkles, Bot, Wand2, ShoppingCart, Eye } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              Welcome back, {user?.name?.split(' ')[0]?.charAt(0)?.toUpperCase() + user?.name?.split(' ')[0]?.slice(1) || 'Creator'}! 👋
            </h1>
            <p className="text-slate-600 text-sm">
              Ready to create something amazing today?
            </p>
          </div>
          <Link to={createPageUrl("CourseCreator")}>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-600 font-medium text-sm">Total Courses</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalCourses}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-600 font-medium text-sm">Average Rating</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.avgRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Courses</h2>
                <Link to="/courses" className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                </div>
              ) : recentCourses.length > 0 ? (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{course.title}</h3>
                        <p className="text-sm text-slate-600">{course.category || 'Business'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">Published</span>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No courses yet. Create your first course!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <Link to={createPageUrl("CourseCreator")}>
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <PlusCircle className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">Create Course</h3>
                        <p className="text-xs text-violet-100">AI-powered generation</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("AITutor")}>
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <Bot className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">AI Tutor</h3>
                        <p className="text-xs text-teal-100">Get instant help</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("AITools")}>
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <Wand2 className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">AI Tools</h3>
                        <p className="text-xs text-pink-100">Notes & Resume</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("Storefront")}>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <ShoppingCart className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">My Storefront</h3>
                        <p className="text-xs text-blue-100">Sell your courses</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              Welcome back, {(user.full_name?.split(' ')[0] || user.name?.split(' ')[0])?.charAt(0)?.toUpperCase() + (user.full_name?.split(' ')[0] || user.name?.split(' ')[0])?.slice(1) || 'Creator'}! 👋
            </h1>
            <p className="text-slate-600 text-sm">
              Ready to create something amazing today?
            </p>
          </div>
          <Link to={createPageUrl("CourseCreator")}>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-600 font-medium text-sm">Total Courses</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">2</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-600 font-medium text-sm">Average Rating</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">4.65</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Courses</h2>
                <Link to="/courses" className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Introduction to React</h3>
                    <p className="text-sm text-slate-600">Business</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">Published</span>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Advanced JavaScript</h3>
                    <p className="text-sm text-slate-600">Business</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">Published</span>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <Link to={createPageUrl("CourseCreator")}>
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <PlusCircle className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">Create Course</h3>
                        <p className="text-xs text-violet-100">AI-powered generation</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("AITutor")}>
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <Bot className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">AI Tutor</h3>
                        <p className="text-xs text-teal-100">Get instant help</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("AITools")}>
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <Wand2 className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">AI Tools</h3>
                        <p className="text-xs text-pink-100">Notes & Resume</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to={createPageUrl("Storefront")}>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-md">
                    <div className="flex items-center gap-3 text-white">
                      <ShoppingCart className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">My Storefront</h3>
                        <p className="text-xs text-blue-100">Sell your courses</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

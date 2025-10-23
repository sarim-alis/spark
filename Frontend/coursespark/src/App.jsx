// Imports.
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/Layout';
import Dashboard from '@/pages/Dashboard';
import Homepage from '@/pages/Homepage';
import CourseCreator from '@/pages/CourseCreator';
import MyCourses from '@/pages/MyCourses';
import CourseEditor from '@/pages/CourseEditor';
import CourseViewer from '@/pages/CourseViewer';
import Storefront from '@/pages/Storefront';
import AITutor from '@/pages/AITutor';
import AITools from '@/pages/AITools';
import InterviewPrep from '@/pages/InterviewPrep';
import PaymentSuccess from '@/pages/PaymentSuccess';
import SubscriptionSuccess from '@/pages/SubscriptionSuccess';
import Profile from '@/pages/Profile';
import AdminSync from '@/pages/AdminSync';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import AdminLogin from '@/pages/Auth/AdminLogin';
import AuthProvider from '@/context/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminLayout from '@/pages/Admin/AdminLayout';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import AdminProfile from '@/pages/Admin/AdminProfile';
import Portfolio from '@/pages/Portfolio';
import { Toaster } from 'react-hot-toast';
import AdminUser from './pages/Admin/AdminUser';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminSubscription from './pages/Admin/AdminSubscription';


// App.
export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<AdminUser />}/>
          <Route path="courses" element={<AdminCourses />} />
          <Route path="/admin/subscriptions" element={<AdminSubscription />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={<Homepage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="coursecreator" element={<CourseCreator />} />
          <Route path="mycourses" element={<MyCourses />} />
          <Route path="courseeditor/:id" element={<CourseEditor />} />
          <Route path="courseviewer/:id" element={<CourseViewer />} />
          <Route path="storefront" element={<Storefront />} />
          <Route path="aitutor" element={<AITutor />} />
          <Route path="aitools" element={<AITools />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="interviewprep" element={<InterviewPrep />} />
          <Route path="paymentsuccess" element={<PaymentSuccess />} />
          <Route path="subscriptionsuccess" element={<SubscriptionSuccess />} />
          <Route path="profile" element={<Profile />} />
          <Route path="" element={<Profile />} />
          <Route path="adminsync" element={<AdminSync />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

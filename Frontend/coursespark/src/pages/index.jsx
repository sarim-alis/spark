import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Storefront from "./Storefront";
import CourseEditor from "./CourseEditor";
import Profile from "./Profile";
import CourseViewer from "./CourseViewer";
import AITutor from "./AITutor";
import Homepage from "./Homepage";
import AITools from "./AITools";
import PaymentSuccess from "./PaymentSuccess";
import AdminSync from "./AdminSync";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Simple placeholder components for missing pages
const CourseCreator = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Course Creator</h1>
    <p>Create amazing courses with AI assistance</p>
  </div>
);

const MyCourses = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">My Courses</h1>
    <p>Manage your published courses</p>
  </div>
);

const SubscriptionSuccess = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Subscription Success</h1>
    <p>Thank you for subscribing!</p>
  </div>
);

const PAGES = {
    Dashboard: Dashboard,
    CourseCreator: CourseCreator,
    Storefront: Storefront,
    MyCourses: MyCourses,
    CourseEditor: CourseEditor,
    Profile: Profile,
    CourseViewer: CourseViewer,
    AITutor: AITutor,
    Homepage: Homepage,
    AITools: AITools,
    PaymentSuccess: PaymentSuccess,
    SubscriptionSuccess: SubscriptionSuccess,
    AdminSync: AdminSync,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/CourseCreator" element={<CourseCreator />} />
                <Route path="/Storefront" element={<Storefront />} />
                <Route path="/MyCourses" element={<MyCourses />} />
                <Route path="/CourseEditor" element={<CourseEditor />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/CourseViewer" element={<CourseViewer />} />
                <Route path="/AITutor" element={<AITutor />} />
                <Route path="/Homepage" element={<Homepage />} />
                <Route path="/AITools" element={<AITools />} />
                <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                <Route path="/SubscriptionSuccess" element={<SubscriptionSuccess />} />
                <Route path="/AdminSync" element={<AdminSync />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
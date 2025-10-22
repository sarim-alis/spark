// Imports.
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ShieldCheck } from 'lucide-react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { adminAPI } from '@/services/api';


// Frontend.
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersResponse = await adminAPI.getAllUsers();
      const allUsers = usersResponse.data || [];
      const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
      
      // Get 5 latest users
      const sortedUsers = [...nonAdminUsers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLatestUsers(sortedUsers.slice(0, 5));
      
      // Fetch courses
      const coursesResponse = await adminAPI.getAllCourses();
      const coursesData = coursesResponse.data.data || coursesResponse.data || [];
      const publishedCourses = coursesData.filter(course => course.is_published === 1 || course.is_published === true);
      
      // Get 5 latest courses
      const sortedCourses = [...publishedCourses].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLatestCourses(sortedCourses.slice(0, 5));
      
      // Update stats
      setStats({
        totalUsers: nonAdminUsers.length,
        totalCourses: publishedCourses.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor((now - created) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100'},
    { title: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: BookOpen, color: 'text-green-600', bgColor: 'bg-green-100'},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-violet-600">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-4 rounded-full`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestUsers.length > 0 ? latestUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar size={40} src={user.profile_picture_url} icon={<UserOutlined />} className="border-2 border-violet-200">
                        {!user.profile_picture_url && user.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(user.created_at)}</span>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Recent Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestCourses.length > 0 ? latestCourses.map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src={course.thumbnail_url || 'https://via.placeholder.com/60'} alt={course.title} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 line-clamp-1">{course.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{course.description || 'No description'}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(course.created_at)}</span>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No courses yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
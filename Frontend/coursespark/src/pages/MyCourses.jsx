// Imports.
import { useEffect, useState, useCallback, useContext } from 'react';
import { courseAPI } from '@/services/courseApi';
import { AuthContext } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MyCourseCard from '@/components/my-courses/MyCourseCard';
import MyCourseRow from '@/components/my-courses/MyCourseRow';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PlusCircle, Grid3x3, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { message } from 'antd';


// Frontend.
export default function MyCourses() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch courses from Laravel API
      const response = await courseAPI.list();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
    } catch (e) {
      console.error('Failed to load courses', e);
      message.error('Failed to load courses');
      setCourses([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Handle status change (toggle).
  const handleStatusChange = async (id) => {
    try {
      const response = await courseAPI.togglePublish(id);
      const updatedCourse = response.data.data;
      setCourses(prev => prev.map(c => c.id === id ? updatedCourse : c));
      message.success(response.data.message);
    } catch (error) {
      console.error('Failed to toggle course status', error);
      message.error('Failed to toggle course status');
    }
  };

  // Handle delete.
  const handleDelete = async (id) => {
    try {
      await courseAPI.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      message.success('Course deleted successfully');
    } catch (error) {
      console.error('Failed to delete course', error);
      message.error('Failed to delete course');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-600 text-sm mt-1">Manage, edit, and track your course performance.</p>
        </div>
        <Link to={createPageUrl('CourseCreator')}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
            <PlusCircle className="w-4 h-4 mr-2" /> Create New Course
          </Button>
        </Link>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-slate-700 text-white hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
          >
            <Grid3x3 className="w-4 h-4 mr-1" /> Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-slate-700 text-white hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
          >
            <List className="w-4 h-4 mr-1" /> List
          </Button>
        </div>
      </div>

      {/* Courses Display */}
      {courses.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <p className="text-slate-600 mb-4 text-lg">You don't have any courses yet.</p>
          <Link to={createPageUrl('CourseCreator')}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="w-4 h-4 mr-2" /> Create your first course
            </Button>
          </Link>
        </Card>
      ) : filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600 text-lg">No courses found matching "{searchQuery}"</p>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(c => (
            <MyCourseCard key={c.id} course={c} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map(c => (
            <MyCourseRow key={c.id} course={c} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

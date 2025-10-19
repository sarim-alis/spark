// Imports.
import { useEffect, useState, useCallback } from 'react';
import { Course, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MyCourseCard from '@/components/my-courses/MyCourseCard';
import MyCourseRow from '@/components/my-courses/MyCourseRow';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PlusCircle } from 'lucide-react';


// Frontend.
export default function MyCourses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await User.me();
      setUser(u);
      // Filter by creator email when available; fallback to list().
      let data = [];
      try {
        data = await Course.filter({ created_by: u.email });
      } catch {
        data = await Course.list();
      }
      setCourses(data || []);
    } catch (e) {
      console.error('Failed to load courses', e);
      setCourses([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Handle status change.
  const handleStatusChange = (id, published) => {
    // Dev mode: update local state only (mockCourse has no update)
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_published: published } : c));
    console.log('Publish toggle (dev only):', { id, published });
  };

  // Handle delete.
  const handleDelete = (id) => {
    // Dev mode: remove locally
    setCourses(prev => prev.filter(c => c.id !== id));
    console.log('Delete course (dev only):', { id });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Courses</h1>
          <p className="text-slate-600 text-sm">Manage and edit your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >Grid</Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >List</Button>
          <Link to={createPageUrl('CourseCreator')}>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <PlusCircle className="w-4 h-4 mr-2" /> New Course
            </Button>
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-600 mb-4">You don't have any courses yet.</p>
          <Link to={createPageUrl('CourseCreator')}>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <PlusCircle className="w-4 h-4 mr-2" /> Create your first course
            </Button>
          </Link>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <MyCourseCard key={c.id} course={c} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(c => (
            <MyCourseRow key={c.id} course={c} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

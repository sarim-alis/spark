// Imports.
import { useState, useEffect, useCallback } from "react";
import { courseAPI } from "@/services/courseApi";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share2, BookOpen, Users, EyeOff, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";


// Card.
function CourseCard({ course }) {
  return (
  <Link to={`/courseviewer/${course.id}`}>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400'} alt={course.title}className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {course.category && (
            <Badge className="absolute top-3 right-3 bg-white/90 text-slate-800">{course.category}</Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-2xl font-bold text-purple-600">${course.price || 0}</span>
            {course.level && (
              <Badge variant="outline" className="text-xs">{course.level}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


// Frontend.
export default function Storefront() {
  const [creator, setCreator] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const location = useLocation();

  // Load store front data.
  const loadStorefrontData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      let creatorEmail = params.get('creator');
      let creatorData;

      try {
        const currentUserData = await User.me();
        setCurrentUser(currentUserData);
      } catch (error) {
        setCurrentUser(null);
      }

      if (creatorEmail) {
        const users = await User.filter({ email: creatorEmail });
        creatorData = users[0];
      } else {
        const loggedInUser = await User.me();
        if (loggedInUser) {
          creatorData = loggedInUser;
          creatorEmail = loggedInUser.email;
        } else {
          throw new Error("No creator specified and user not logged in.");
        }
      }
      
      setCreator(creatorData);
      setIsOwner(currentUser?.email === creatorEmail);

      // Fetch only published courses (is_published = 1) for the logged-in user
      const response = await courseAPI.list({
        is_published: 1
      });
      const creatorCourses = response.data.data || [];
      
      setCourses(creatorCourses);
    } catch (error) {
      console.error("Error loading storefront data:", error);
      setCreator(null);
      setCourses([]);
    }
    setIsLoading(false);
  }, [location.search, currentUser?.email]);

  useEffect(() => {
    loadStorefrontData();
  }, [loadStorefrontData]);

  // Handle share.
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Storefront URL copied to clipboard!");
    });
  };

  // Handle unpublish course.
  const handleUnpublishCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to remove this course from your storefront?")) {
      try {
        await courseAPI.togglePublish(courseId);
        setCourses(courses.filter(c => c.id !== courseId));
        alert("Course removed from storefront successfully!");
      } catch (error) {
        console.error("Error unpublishing course:", error);
        alert("Error removing course. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Skeleton className="h-32 md:h-48 w-full rounded-2xl mb-6 md:mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}><Skeleton className="h-56 md:h-64 w-full" /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-600">Creator not found or not specified.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card className="mb-6 md:mb-8 shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-24 md:h-32 lg:h-40 bg-gradient-to-r from-blue-400 to-purple-500" />
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left -mt-12 md:-mt-16 space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-lg">
                <AvatarImage src={creator.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.email}`} />
                <AvatarFallback className="text-lg md:text-xl">{creator.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">{creator.full_name}</h1>
                <p className="text-slate-600 mt-1 text-sm md:text-base">{creator.bio || "Passionate creator and educator"}</p>
                <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs md:text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {courses.length} Courses</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {courses.reduce((sum, c) => sum + (c.total_students || 0), 0)} Students</span>
                </div>
              </div>
              <div className="flex gap-2">
                {isOwner && (
                  <Link to={createPageUrl("MyCourses")}>
                    <Button variant="outline" className="text-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Courses
                    </Button>
                  </Link>
                )}
                <Button onClick={handleShare} variant="outline" className="text-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 text-center md:text-left">
            Courses by {creator.full_name?.split(' ')[0]}
          </h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {courses.map(course => (
                <div key={course.id} className="relative group">
                  <CourseCard course={course} />
                  {isOwner && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUnpublishCourse(course.id)}
                        className="bg-red-500/80 hover:bg-red-600 backdrop-blur-sm text-white"
                      >
                        <EyeOff className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 bg-white/50 rounded-2xl">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-slate-600">No published courses yet</h3>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                {isOwner ? "Publish your first course to get started!" : "Check back later for amazing new content!"}
              </p>
              {isOwner && (
                <Link to={createPageUrl("CourseCreator")} className="mt-4 inline-block">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                    Create Your First Course
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
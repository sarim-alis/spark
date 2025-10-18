import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Eye, Users, DollarSign, ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentCourses({ courses, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-bold text-slate-800">Recent Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-0">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl border">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
              <Skeleton className="h-5 w-12 flex-shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-3 space-y-2 sm:space-y-0">
        <CardTitle className="text-sm font-bold text-slate-800">Recent Courses</CardTitle>
        <Link to={createPageUrl("MyCourses")}>
          <Button variant="outline" size="sm" className="text-slate-600 hover:text-amber-600 w-full sm:w-auto text-xs">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {courses.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1 text-sm">No courses yet</h3>
            <p className="text-slate-500 mb-3 text-xs">Create your first AI-powered course</p>
            <Link to={createPageUrl("CourseCreator")}>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs">
                Create Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-0.5 text-xs truncate">{course.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" />
                      {course.total_students || 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="w-2.5 h-2.5" />
                      ${course.price || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs px-1.5 py-0.5 hidden sm:inline-flex">
                    {course.is_published ? "Published" : "Draft"}
                  </Badge>
                  <Link to={`/courseeditor/${course.id}`}>
                    <Button variant="outline" size="sm" className="p-1 h-6 w-6">
                      <Eye className="w-2.5 h-2.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  Edit3,
  Check
} from "lucide-react";

export default function GeneratedCoursePreview({ course, onEdit, onSave, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(course);

  const handleSave = () => {
    onEdit(editedCourse);
    setIsEditing(false);
  };

  const handlePublish = () => {
    onSave();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Course Header */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Thumbnail */}
            <div className="w-full md:w-64 flex-shrink-0">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editedCourse.title}
                    onChange={(e) => setEditedCourse({...editedCourse, title: e.target.value})}
                    className="text-xl font-bold"
                  />
                  <Textarea
                    value={editedCourse.description}
                    onChange={(e) => setEditedCourse({...editedCourse, description: e.target.value})}
                    rows={3}
                  />
                  <Input
                    type="number"
                    value={editedCourse.price}
                    onChange={(e) => setEditedCourse({...editedCourse, price: e.target.value === '' ? '' : parseFloat(e.target.value)})}
                    className="w-32"
                    placeholder="Price"
                  />
                  <Input
                    placeholder="External Purchase URL (optional)"
                    value={editedCourse.external_url || ''}
                    onChange={(e) => setEditedCourse({...editedCourse, external_url: e.target.value})}
                    className="w-full"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-800">{course.title}</h1>
                  <p className="text-slate-600 text-base leading-relaxed">{course.description}</p>
                  
                  {/* Course Stats */}
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration_hours}h
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.lessons.length} lessons
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {course.level}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {course.price}
                    </Badge>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Preview */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      Lesson {lesson.order}: {lesson.title}
                    </h3>
                    <div 
                      className="text-slate-600 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: lesson.content.substring(0, 200) + "..." }}
                    />
                  </div>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {lesson.duration_minutes}min
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Edit
        </Button>
        
        <Button 
          onClick={handlePublish}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2 shadow-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Continue
        </Button>
      </div>
    </div>
  );
}

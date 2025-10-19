import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, BookOpen, Users, Clock } from "lucide-react";

export default function CoursePromptForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    topic: "",
    audience: "",
    level: "beginner",
    duration: 4,
    category: "business",
    price: 49.99,
    thumbnailUrl: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const categories = [
    "business", "technology", "design", "marketing", 
    "personal_development", "health", "education", "arts"
  ];

  const audiences = [
    "Complete beginners",
    "Working professionals",
    "Students and academics",
    "Entrepreneurs",
    "Freelancers",
    "Career changers"
  ];

  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center p-3 md:p-4">
        <CardTitle className="text-base md:text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
          Describe Your Course
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {/* Course Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">What do you want to teach?</label>
            <Textarea
              placeholder="e.g., JavaScript for beginners, Digital Marketing Strategy, Mindfulness and Meditation..."
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="min-h-12 resize-none text-xs md:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                Target Audience
              </label>
              <Select
                value={formData.audience}
                onValueChange={(value) => setFormData({...formData, audience: value})}
                required
              >
                <SelectTrigger className="text-xs md:text-sm">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience} value={audience} className="text-xs md:text-sm">
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Difficulty Level</label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({...formData, level: value})}
              >
                <SelectTrigger className="text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Course Duration (hours)
              </label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
              >
                <SelectTrigger className="text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="16">16+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Price ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="49.99"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              className="text-xs md:text-sm"
            />
          </div>

          {/* Course Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Course Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.files[0]})}
              className="text-xs md:text-sm"
            />
            {formData.thumbnailUrl && (
              <p className="text-xs text-slate-600">Selected: {formData.thumbnailUrl.name}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!formData.topic || !formData.audience || isGenerating}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 md:py-3 text-xs md:text-sm shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white mr-2" />
                Generating Your Course...
              </>
            ) : (
              <>
                <Wand2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Generate Course with AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
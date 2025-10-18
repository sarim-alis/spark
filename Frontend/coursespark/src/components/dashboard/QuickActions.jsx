
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PlusCircle, Store, BookOpen, Sparkles, Bot, Wand2 } from "lucide-react";

const ActionButton = ({ icon: Icon, title, description, href, gradient }) => (
  <Link to={href} className="block">
    <Button 
      variant="outline" 
      className={`w-full h-auto p-2 justify-start border-0 ${gradient} text-white hover:scale-105 transition-all duration-300 shadow-lg text-left`}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs truncate">{title}</div>
          <div className="text-xs opacity-90 truncate">{description}</div>
        </div>
      </div>
    </Button>
  </Link>
);

export default function QuickActions() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <ActionButton
          icon={PlusCircle}
          title="Create Course"
          description="AI-powered generation"
          href={createPageUrl("CourseCreator")}
          gradient="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        />
        <ActionButton
          icon={Bot}
          title="AI Tutor"
          description="Get instant help"
          href={createPageUrl("AITutor")}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        />
        <ActionButton
          icon={Wand2}
          title="AI Tools"
          description="Notes & Resume"
          href={createPageUrl("AITools")}
          gradient="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        />
        <ActionButton
          icon={Store}
          title="My Storefront"
          description="Sell your courses"
          href={createPageUrl("Storefront")}
          gradient="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        />
      </CardContent>
    </Card>
  );
}

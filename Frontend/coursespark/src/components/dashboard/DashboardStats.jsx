
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, color, isLoading }) => (
  <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
    <div className={`absolute top-0 right-0 w-12 h-12 transform translate-x-4 -translate-y-4 ${color} rounded-full opacity-10`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3">
      <CardTitle className="text-xs font-medium text-slate-600 truncate pr-2">{title}</CardTitle>
      <div className={`p-1.5 rounded-md ${color} bg-opacity-15 flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </CardHeader>
    <CardContent className="px-3 pb-3 pt-0">
      {isLoading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        <div className="text-lg sm:text-xl font-bold text-slate-800 truncate">{value}</div>
      )}
    </CardContent>
  </Card>
);

export default function DashboardStats({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        title="Total Courses"
        value={stats.totalCourses}
        icon={BookOpen}
        color="bg-blue-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon={Users}
        color="bg-emerald-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        color="bg-amber-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Average Rating"
        value={stats.avgRating.toFixed(1)}
        icon={Star}
        color="bg-purple-500"
        isLoading={isLoading}
      />
    </div>
  );
}

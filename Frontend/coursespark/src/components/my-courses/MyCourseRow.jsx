import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Edit, Trash2, Users, DollarSign, MoreVertical, BarChart3, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MyCourseRow({ course, onStatusChange, onDelete }) {
  return (
    <Card className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <img src={course.thumbnail_url} alt={course.title} className="w-full sm:w-24 md:w-32 h-20 md:h-24 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-lg mb-1 line-clamp-2">{course.title}</h3>
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500">
          <span className="flex items-center gap-1"><Users className="w-3 h-3 md:w-4 md:h-4" /> {course.total_students || 0} students</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 md:w-4 md:h-4" /> ${(course.total_sales || 0).toFixed(2)} sales</span>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs">
          {course.is_published ? "Published" : "Draft"}
        </Badge>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={course.is_published} 
            onCheckedChange={(checked) => onStatusChange(course.id, checked)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-3 h-3 md:w-4 md:h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
             <DropdownMenuItem asChild>
              <Link to={`/courseeditor/${course.id}`} className="flex items-center gap-2 w-full cursor-pointer text-xs md:text-sm">
                <Edit className="w-3 h-3 md:w-4 md:h-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={createPageUrl(`Analytics?course_id=${course.id}`)} className="flex items-center gap-2 w-full cursor-pointer text-xs md:text-sm">
                <BarChart3 className="w-3 h-3 md:w-4 md:h-4" /> Analytics
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link to={createPageUrl(`Storefront?creator=${course.created_by}`)} target="_blank" className="flex items-center gap-2 w-full cursor-pointer text-xs md:text-sm">
                <Eye className="w-3 h-3 md:w-4 md:h-4" /> View on Storefront
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(course.id)} className="text-red-500 flex items-center gap-2 cursor-pointer text-xs md:text-sm">
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
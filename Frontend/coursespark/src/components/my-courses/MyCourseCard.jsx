import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function MyCourseCard({ course, onStatusChange, onDelete }) {
  return (
    <Card className="flex flex-col h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="relative p-0">
        <Link to={`/courseeditor/${course.id}`}>
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-32 md:h-40 object-cover rounded-t-lg" />
        </Link>
        <div className="absolute top-2 right-2">
           <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs">
             {course.is_published ? "Published" : "Draft"}
           </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4 flex-grow">
        <CardTitle className="text-sm md:text-lg font-bold mb-2 line-clamp-2">{course.title}</CardTitle>
        <p className="text-xs md:text-sm text-slate-600 line-clamp-2">{course.description}</p>
      </CardContent>
      <CardFooter className="p-3 md:p-4 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={course.is_published} 
            onCheckedChange={() => onStatusChange(course.id)}
            id={`publish-switch-${course.id}`}
          />
          <label htmlFor={`publish-switch-${course.id}`} className="text-xs md:text-sm font-medium text-slate-600">
            Publish
          </label>
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
              <Link to={createPageUrl(`Storefront?creator=${course.created_by}`)} target="_blank" className="flex items-center gap-2 w-full cursor-pointer text-xs md:text-sm">
                <Eye className="w-3 h-3 md:w-4 md:h-4" /> View on Storefront
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(course.id)} className="text-red-500 flex items-center gap-2 cursor-pointer text-xs md:text-sm">
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
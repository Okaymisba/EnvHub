import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, ArrowRight } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
  ownerEmail?: string;
  viewMode?: 'grid' | 'list';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectClick,
  ownerEmail,
  viewMode = 'grid'
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <Card
        className={`
          flex flex-row items-center min-h-[80px] px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-0 relative overflow-hidden group transition-all
          hover:scale-[1.01] hover:ring-2 hover:ring-purple-700
        `}
        onClick={() => onProjectClick(project)}
      >
        <div className="flex-1 flex items-center gap-6 overflow-x-auto">
          <div className="min-w-[180px] font-semibold text-white flex items-center gap-2">
            {project.name}
            {ownerEmail && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 ml-2">
                Shared
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[180px]">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(project.created_at)}
          </div>
          {ownerEmail && (
            <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[220px]">
              <User className="mr-1 h-4 w-4" />
              Owner: {ownerEmail}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[120px]">
            <FileText className="mr-1 h-4 w-4" />
            {project.version_count || 0} versions
          </div>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <button
            className="flex items-center gap-1 px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition"
            onClick={e => {
              e.stopPropagation();
              onProjectClick(project);
            }}
          >
            View <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      className={`
        group transition-all cursor-pointer border-0
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl hover:scale-[1.03]
        relative overflow-hidden
      `}
      onClick={() => onProjectClick(project)}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-900/30 to-blue-900/20 z-0" />
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          {project.name}
          {ownerEmail && (
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              Shared
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="z-10">
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Created {formatDate(project.created_at)}
          </div>
          {ownerEmail && (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Owner: {ownerEmail}
            </div>
          )}
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            {project.version_count || 0} versions
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition"
            onClick={e => {
              e.stopPropagation();
              onProjectClick(project);
            }}
          >
            View <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

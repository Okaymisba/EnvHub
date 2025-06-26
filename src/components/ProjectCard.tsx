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
      <div
        className={`
          w-full bg-transparent border-b border-slate-800
          flex flex-col sm:flex-row items-start sm:items-center
          px-2 sm:px-4 py-3 group transition hover:bg-slate-800/60 cursor-pointer
          last:border-b-0
        `}
        onClick={() => onProjectClick(project)}
      >
        {/* Top row: name + view button (mobile), name only (desktop) */}
        <div className="flex w-full items-center justify-between sm:justify-start gap-2 sm:gap-6">
          <div className="font-semibold text-white flex items-center gap-2 min-w-[120px]">
            {project.name}
            {ownerEmail && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 ml-2">
                Shared
              </Badge>
            )}
          </div>
          {/* View button: right of name on mobile, at end on desktop */}
          <div className="flex-shrink-0 sm:hidden">
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
        </div>
        {/* Details row: only on sm and up */}
        <div className="hidden sm:flex flex-1 items-center gap-6 w-full mt-0">
          <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[120px]">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(project.created_at)}
          </div>
          {ownerEmail && (
            <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[180px] whitespace-nowrap">
              <User className="mr-1 h-4 w-4" />
              <span>Owner:</span>
              <span className="ml-1">{ownerEmail}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-400 text-sm min-w-[100px]">
            <FileText className="mr-1 h-4 w-4" />
            {project.version_count || 0} versions
          </div>
          {/* View button on the far right for desktop */}
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
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Card
      className={`
        group transition-all cursor-pointer border border-purple-900
        bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 shadow-2xl rounded-2xl
        hover:scale-[1.03] hover:border-blue-700 relative overflow-hidden
      `}
      onClick={() => onProjectClick(project)}
    >
      {/* Animated hover overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-900/30 to-blue-900/20 z-0" />
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          {project.name}
          {ownerEmail && (
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-700 to-blue-700 text-gray-100">
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
            className="flex items-center gap-1 px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition"
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

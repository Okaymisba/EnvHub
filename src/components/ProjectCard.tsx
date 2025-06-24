
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
  ownerEmail?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectClick,
  ownerEmail
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={() => onProjectClick(project)}
    >
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
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

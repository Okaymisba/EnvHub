
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateProject: (name: string, password: string) => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onClose,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    
    setLoading(true);
    try {
      await onCreateProject(name.trim(), password);
      setName('');
      setPassword('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="project-password">Project Password</Label>
            <Input
              id="project-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter project password"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim() || !password.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

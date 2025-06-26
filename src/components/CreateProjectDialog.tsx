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
      <DialogContent className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl text-white">
        <>
          {/* Animated background blob */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-900 opacity-20 rounded-full blur-3xl pointer-events-none" />
          <DialogHeader className="relative z-10 px-6 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Create New Project
            </DialogTitle>
            <p className="text-gray-400 text-center mt-2 text-base">
              Secure your secrets with a project password. Only you and your team can access them.
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6 px-6 pb-8 pt-2">
            <div>
              <Label htmlFor="project-name" className="text-gray-300 mb-1 block text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full bg-black/70 border border-purple-800 text-white placeholder:text-gray-500 rounded-lg px-3 py-2 focus:border-blue-600 focus:ring-0"
                required
              />
            </div>
            <div>
              <Label htmlFor="project-password" className="text-gray-300 mb-1 block text-sm font-medium">
                Project Password
              </Label>
              <Input
                id="project-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter project password"
                className="w-full bg-black/70 border border-purple-800 text-white placeholder:text-gray-500 rounded-lg px-3 py-2 focus:border-blue-600 focus:ring-0"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                This password encrypts your secrets. Don’t lose it!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-700 text-gray-900 hover:bg-gray-800 rounded-lg py-2 transition"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim() || !password.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg py-2 transition disabled:opacity-60"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Crown } from 'lucide-react';
import { SubscriptionLimitService, SubscriptionLimits } from '@/services/subscriptionLimitService';
import { useToast } from '@/hooks/use-toast';

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
  const [canCreate, setCanCreate] = useState(true);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      checkLimits();
    }
  }, [open]);

  const checkLimits = async () => {
    try {
      const [canCreateResult, limitsResult, countResult] = await Promise.all([
        SubscriptionLimitService.canUserCreateProject(),
        SubscriptionLimitService.getUserSubscriptionLimits(),
        SubscriptionLimitService.getCurrentProjectCount()
      ]);
      
      setCanCreate(canCreateResult);
      setLimits(limitsResult);
      setCurrentCount(countResult);
    } catch (error) {
      console.error('Failed to check limits:', error);
      toast({
        title: 'Error',
        description: 'Failed to check subscription limits',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (!canCreate) {
      toast({
        title: 'Project Limit Reached',
        description: `You've reached your ${limits?.plan} plan limit of ${limits?.max_projects} projects. Upgrade to create more projects.`,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await onCreateProject(name.trim(), password);
      setName('');
      setPassword('');
      onClose();
    } catch (error: any) {
      if (error.message?.includes('check_user_can_create_project')) {
        toast({
          title: 'Project Limit Reached',
          description: `You've reached your subscription limit for creating projects. Please upgrade your plan to create more projects.`,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create project',
          variant: 'destructive'
        });
      }
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

          {limits && (
            <div className="px-6 mb-4">
              <div className="bg-black/90 border border-purple-900 shadow-2xl rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Current Plan: {limits.plan}</span>
                  <span className="text-sm text-white">
                    Projects: {currentCount}/{limits.max_projects}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentCount / limits.max_projects) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {!canCreate && limits && (
            <div className="px-6 mb-4">
              <Alert className="border-orange-600 bg-orange-900/20">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-200">
                  You've reached your {limits.plan} plan limit of {limits.max_projects} projects. 
                  <br />
                  <span className="text-orange-300 font-medium">Upgrade your plan to create more projects.</span>
                </AlertDescription>
              </Alert>
            </div>
          )}

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
                disabled={!canCreate}
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
                disabled={!canCreate}
              />
              <p className="text-xs text-white mt-2">
                This password encrypts your secrets. Don't lose it!
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
              {canCreate ? (
                <Button
                  type="submit"
                  disabled={loading || !name.trim() || !password.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg py-2 transition disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg py-2 transition"
                  onClick={() => {
                    // This would open subscription manager - you can implement this
                    toast({
                      title: 'Upgrade Required',
                      description: 'Please upgrade your plan to create more projects',
                    });
                  }}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              )}
            </div>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
};

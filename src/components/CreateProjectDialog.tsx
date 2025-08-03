// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

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
import { AlertTriangle, Crown, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validatePassword = (pass: string, confirmPass: string = '') => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isMatching = confirmPass === '' || pass === confirmPass;
    
    const isValid = minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isMatching;
    setIsPasswordValid(isValid);
    
    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    if (!isMatching) return 'Passwords do not match';
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword, confirmPassword));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordError(validatePassword(password, newConfirmPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !isPasswordValid) return;

    // Final validation check
    const finalValidation = validatePassword(password, confirmPassword);
    if (finalValidation) {
      setPasswordError(finalValidation);
      return;
    }

    setLoading(true);
    try {
      await onCreateProject(name.trim(), password);
      setName('');
      setPassword('');
      setConfirmPassword('');
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

  const isFormValid = () => {
    const isNameValid = name.trim().length > 0;
    const isPasswordFilled = password.length > 0 && confirmPassword.length > 0;
    return isNameValid && isPasswordFilled && isPasswordValid;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl text-white max-h-[90vh] overflow-hidden flex flex-col">
        {/* Custom scrollbar styles */}
        <style jsx global>{`
          .scrollbar-custom::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.5);
            border-radius: 10px;
            transition: all 0.3s ease;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: rgba(192, 132, 252, 0.7);
          }
          .scrollbar-custom {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.5) rgba(0, 0, 0, 0.1);
          }
        `}</style>
        <div className="overflow-y-auto px-1 scrollbar-custom">
          {/* Animated background blob */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-900 opacity-20 rounded-full blur-3xl pointer-events-none" />
          <DialogHeader className="relative z-10 px-4 pt-6 pb-2 sm:px-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white text-center">
              Create New Project
            </DialogTitle>
            <p className="text-sm sm:text-base text-gray-300 text-center mt-2">
              Secure your secrets with a project password. Only you and your team can access them.
            </p>
          </DialogHeader>

          {limits && (
            <div className="px-4 sm:px-6 mb-4">
              <div className="bg-black/90 border border-purple-900 shadow-2xl rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <span className="text-xs sm:text-sm text-gray-300">Current Plan: {limits.plan}</span>
                  <span className="text-xs sm:text-sm text-gray-300">
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
            <div className="px-4 sm:px-6 mb-4">
              <Alert className="border-orange-600 bg-orange-900/20">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-xs sm:text-sm text-orange-200">
                  You've reached your {limits.plan} plan limit of {limits.max_projects} projects.
                  <br className="hidden sm:block" />
                  <span className="text-orange-300 font-medium">Upgrade your plan to create more projects.</span>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4 px-4 sm:px-6 pb-6 pt-2">
            <div>
              <Label htmlFor="project-name" className="text-gray-300 mb-1 block text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => {
                  // Remove spaces and convert to lowercase
                  const value = e.target.value.replace(/\s+/g, '');
                  // Only allow alphanumeric characters, hyphens, and underscores
                  const filteredValue = value.replace(/[^a-zA-Z0-9-_]/g, '');
                  setName(filteredValue);
                }}
                placeholder="Enter project name (no spaces)"
                className="w-full bg-black/70 border border-purple-800 text-white placeholder:text-gray-500 rounded-lg px-3 py-2 focus:border-blue-600 focus:ring-0"
                required
                disabled={!canCreate}
                pattern="[a-zA-Z0-9-_]+"
                title="Project name can only contain letters, numbers, hyphens, and underscores"
              />
              {name && (
                <p className="mt-1 text-s pt-1 text-white">
                  Project name will be: <span className="text-green-400 font-mono">{name.toLowerCase().replace(/[^a-z0-9-]/g, '')}</span>
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="project-password" className="text-gray-300 mb-1 block text-sm font-medium">
                Project Password
              </Label>
              <div className="relative">
                <Input
                  id="project-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter project password"
                  className={`w-full bg-black/70 border ${
                    passwordError && !passwordError.includes('match') ? 'border-red-500' : 'border-purple-800'
                  } text-white placeholder:text-gray-500 rounded-lg px-3 py-2 pr-10 focus:border-blue-600 focus:ring-0`}
                  required
                  disabled={!canCreate}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-2">
                <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-yellow-200 font-medium leading-relaxed">
                    <span className="font-bold text-yellow-400">SECURITY NOTICE:</span> This master password is used to encrypt your secrets. For security reasons, we do not store your password in a way that it can be recovered. Please ensure you keep this password in a secure location, as it will be required to access your encrypted data.
                  </p>
                </div>
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center">
                      {password.length >= 8 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-xs">At least 8 characters</span>
                    </div>
                    <div className="flex items-center">
                      {/[A-Z]/.test(password) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-xs">At least one uppercase letter</span>
                    </div>
                    <div className="flex items-center">
                      {/[a-z]/.test(password) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-xs">At least one lowercase letter</span>
                    </div>
                    <div className="flex items-center">
                      {/\d/.test(password) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-xs">At least one number</span>
                    </div>
                    <div className="flex items-center">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-xs">At least one special character</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-gray-300 mb-1 block text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  className={`w-full bg-black/70 border ${
                    passwordError ? 'border-red-500' : 'border-purple-800'
                  } text-white placeholder:text-gray-500 rounded-lg px-3 py-2 pr-10 focus:border-blue-600 focus:ring-0`}
                  required
                  disabled={!canCreate}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs mt-2">{passwordError}</p>
              )}
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
                  disabled={loading || !isFormValid()}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

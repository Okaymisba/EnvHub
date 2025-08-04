// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Save, AlertTriangle, Crown, Upload, FileText, Keyboard } from 'lucide-react';
import { EnvEntry } from '@/types/project';
import { SubscriptionLimitService, SubscriptionLimits } from '@/services/subscriptionLimitService';
import { useToast } from '@/hooks/use-toast';

interface EnvVariableFormProps {
  onSave: (entries: EnvEntry[], password: string) => Promise<void>;
  loading: boolean;
  projectId: string;
  length: number;
}

export const EnvVariableForm: React.FC<EnvVariableFormProps> = ({ onSave, loading, projectId, length}) => {
  const [entries, setEntries] = useState<EnvEntry[]>([{ name: '', value: '', id: '1' }]);
  const [password, setPassword] = useState('');
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [canAddVars, setCanAddVars] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'initial' | 'manual' | 'import'>('initial');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropZoneRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkLimits();
  }, [projectId, entries.length]);

  const checkLimits = async () => {
    try {
      const validEntries = entries.filter(entry => entry.name.trim() && entry.value.trim());
      const [limitsResult, canAddResult] = await Promise.all([
        SubscriptionLimitService.getSubscriptionLimitsForProject(projectId),
        SubscriptionLimitService.canUserAddEnvVars(projectId, validEntries.length),
      ]);

      setLimits(limitsResult);
      setCanAddVars(canAddResult);
    } catch (error) {
      console.error('Failed to check limits:', error);
    }
  };

  const addEntry = async () => {
    const newId = Date.now().toString();
    const newEntries = [...entries, { name: '', value: '', id: newId }];

    // Check if adding this entry would exceed limits
    try {
      const canAdd = await SubscriptionLimitService.canUserAddEnvVars(projectId, newEntries.filter(e => e.name.trim() && e.value.trim()).length);
      if (!canAdd && limits) {
        toast({
          title: 'Environment Variable Limit',
          description: `Your ${limits.plan} plan allows up to ${limits.max_env_vars_per_project} environment variables per project.`,
          variant: 'destructive'
        });
        return;
      }
    } catch (error) {
      console.error('Failed to check limits:', error);
    }

    setEntries(newEntries);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: 'name' | 'value', value: string) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validEntries = entries.filter(entry => entry.name.trim() && entry.value.trim());
    if (validEntries.length === 0 || !password.trim()) return;

    if (!canAddVars) {
      toast({
        title: 'Environment Variable Limit Reached',
        description: `You've reached your ${limits?.plan} plan limit. Upgrade to add more environment variables.`,
        variant: 'destructive'
      });
      return;
    }

    try {
      await onSave(validEntries, password);
      setEntries([{ name: '', value: '', id: '1' }]);
      setPassword('');
    } catch (error: any) {
      if (error.message?.includes('check_user_can_add_env_vars')) {
        toast({
          title: 'Environment Variable Limit Reached',
          description: `You've reached your subscription limit for environment variables in this project. Please upgrade your plan.`,
          variant: 'destructive'
        });
      } else {
        throw error; // Re-throw other errors to be handled by parent
      }
    }
  };

  const validEntryCount = length;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check if file has .env extension or is a text file
    if (!file.name.endsWith('.env') && !file.type.includes('text/plain')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload a .env file',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        toast({
          title: 'Error',
          description: 'Failed to read file',
          variant: 'destructive'
        });
        return;
      }
      parseEnvContent(content);
    };
    reader.readAsText(file);
  };

  const parseEnvContent = (content: string) => {
    try {
      const envVars = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const [name, ...valueParts] = line.split('=');
          const value = valueParts.join('=').replace(/(^['"]|['"]$)/g, '');
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            value: value.trim()
          };
        });

      if (envVars.length > 0) {
        setEntries(prev => [...prev.filter(e => !e.name && !e.value), ...envVars]);
        setViewMode('manual'); // Switch to manual view after import
        toast({
          title: 'Success',
          description: `Imported ${envVars.length} environment variables from .env file`,
        });
      } else {
        toast({
          title: 'No variables found',
          description: 'The file does not contain any valid environment variables',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error parsing .env file:', error);
      toast({
        title: 'Error',
        description: 'Failed to parse .env file',
        variant: 'destructive'
      });
    }
  };

  const renderInitialView = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Add Environment Variables</h3>
      <p className="text-gray-400">Choose how you'd like to add environment variables</p>
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <button
          onClick={() => setViewMode('manual')}
          className="flex flex-col items-center justify-center p-6 border border-purple-800 rounded-xl hover:bg-purple-900/30 transition-colors h-40 bg-black/50"
        >
          <Keyboard className="h-10 w-10 mb-3 text-purple-400" />
          <span className="font-medium text-white">Add Manually</span>
          <p className="text-sm text-gray-400 text-center mt-1">
            Enter environment variables one by one
          </p>
        </button>
        <div 
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors h-40 ${
            isDragging 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-purple-800 hover:border-purple-500 hover:bg-purple-900/10 bg-black/50'
          }`}
        >
          <FileText className="h-10 w-10 mb-3 text-purple-400" />
          <span className="font-medium text-white">Import from File</span>
          <p className="text-sm text-gray-400 text-center mt-1">
            Upload a .env file or drag and drop
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".env,text/plain"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          {viewMode === 'import' ? 'Import Environment Variables' : 'Add Environment Variables'}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('initial')}
          className="text-gray-400 hover:text-white hover:bg-purple-900/30"
        >
          ← Back to options
        </Button>
      </div>
      
      {viewMode === 'import' ? (
        <div 
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-purple-800 hover:border-purple-500 hover:bg-purple-900/10 bg-black/50'
          }`}
        >
          <Upload className="h-12 w-12 mb-4 text-purple-400" />
          <p className="font-medium mb-1 text-white">Upload .env file</p>
          <p className="text-sm text-gray-400 text-center">
            Drag and drop your .env file here, or click to browse
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".env,text/plain"
            className="hidden"
          />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2 items-center bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-xl p-3 border border-purple-800">
                <div className="col-span-5">
                  <Input
                    type="text"
                    placeholder="Variable name"
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                    className="w-full bg-black/70 border border-purple-800 text-white font-mono rounded-lg focus:border-purple-500 focus:ring-0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type={entry.name.toLowerCase().includes('password') ? 'password' : 'text'}
                    placeholder="Variable value"
                    value={entry.value}
                    onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                    className="w-full bg-black/70 border border-purple-800 text-white font-mono rounded-lg focus:border-purple-500 focus:ring-0"
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(entry.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="mt-2 border-purple-800 text-black hover:bg-purple-900/30 hover:text-white"
              disabled={!canAddVars}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Variable
            </Button>
          </div>

          <div className="pt-4 border-t border-purple-800">
            <Label htmlFor="password" className="text-gray-300">Encryption Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to encrypt variables"
              className="mt-1 bg-black/70 border border-purple-800 text-white rounded-lg focus:border-purple-500 focus:ring-0"
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              This password will be used to encrypt your environment variables. Make sure to save it securely.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-400">
              {validEntryCount} of {limits?.max_env_vars_per_project || '∞'} variables used
            </div>
            <Button 
              type="submit" 
              disabled={loading || !password.trim() || entries.every(e => !e.name.trim() || !e.value.trim()) || !canAddVars}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Encrypting & Saving...' : 'Save Variables'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </form>
  );

  return (
    <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center pb-4">
          <Plus className="mr-2 h-5 w-5 text-purple-400" />
          Environment Variables
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!canAddVars && limits && validEntryCount > 0 && (
          <Alert className="border-orange-600 bg-orange-900/20 mb-6">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-200">
              You've reached your {limits.plan} plan limit of {limits.max_env_vars_per_project} environment variables per project.
              <br />
              <span className="text-orange-300 font-medium">Upgrade your plan to add more variables.</span>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="transition-all duration-300 ease-in-out">
          {viewMode === 'initial' ? renderInitialView() : renderForm()}
        </div>
      </CardContent>
    </Card>
  );
};

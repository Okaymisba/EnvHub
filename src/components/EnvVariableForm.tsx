
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Save, AlertTriangle, Crown } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    checkLimits();
  }, [projectId, entries.length]);

  const checkLimits = async () => {
    try {
      const validEntries = entries.filter(entry => entry.name.trim() && entry.value.trim());
      const [limitsResult, canAddResult] = await Promise.all([
        SubscriptionLimitService.getUserSubscriptionLimits(),
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

  return (
    <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="mr-2 h-5 w-5 text-purple-400" />
          Add Environment Variables
        </CardTitle>
        {limits && (
          <div className="bg-black/90 border border-purple-900 shadow-2xl rounded-lg p-3 mt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Plan: {limits.plan}</span>
              <span className="text-sm text-white ">
                Variables: {validEntryCount}/{limits.max_env_vars_per_project}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  validEntryCount >= limits.max_env_vars_per_project ? 'bg-red-600' : 'bg-purple-600'
                }`}
                style={{ width: `${Math.min(100, (validEntryCount / limits.max_env_vars_per_project) * 100)}%` }}
              />
            </div>
          </div>
        )}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex flex-col sm:flex-row gap-3 items-stretch bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-xl p-3 border border-purple-800">
                <div className="flex-1">
                  <Label className="text-gray-300 text-xs">Variable Name</Label>
                  <Input
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id!, 'name', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key == ' ') e.preventDefault();
                    }}
                    placeholder="API_KEY"
                    className="bg-black/70 border border-purple-800 text-white font-mono rounded-lg focus:border-blue-600 focus:ring-0"
                    required
                    autoComplete='off'
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-gray-300 text-xs">Value</Label>
                  <Input
                    value={entry.value}
                    onChange={(e) => updateEntry(entry.id!, 'value', e.target.value)}
                    placeholder="your-secret-value"
                    type="password"
                    className="bg-black/70 border border-purple-800 text-white font-mono rounded-lg focus:border-blue-600 focus:ring-0"
                    required
                    autoComplete='new-password'
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeEntry(entry.id!)}
                  disabled={entries.length === 1}
                  className="border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-600 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {canAddVars ? (
            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              className="w-full border-purple-800 text-gray-900 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-blue-900/20 hover:text-white rounded-lg transition"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Variable
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg py-2 transition"
              onClick={() => {
                toast({
                  title: 'Upgrade Required',
                  description: 'Please upgrade your plan to add more environment variables',
                });
              }}
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Add More Variables
            </Button>
          )}

          <div className="border-t border-purple-900 pt-4">
            <Label className="text-gray-300 text-xs">Project Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter project password to encrypt variables"
              className="bg-black/70 border border-purple-800 text-white rounded-lg focus:border-blue-600 focus:ring-0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This password was set when you created the project and is used to encrypt your environment variables.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !password.trim() || entries.every(e => !e.name.trim() || !e.value.trim()) || !canAddVars}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg py-2 transition disabled:opacity-60"
          >
            {loading ? (
              <>Encrypting & Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Environment Variables
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

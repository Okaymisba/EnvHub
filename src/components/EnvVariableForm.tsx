
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import { EnvEntry } from '@/types/project';

interface EnvVariableFormProps {
  onSave: (entries: EnvEntry[], password: string) => Promise<void>;
  loading: boolean;
}

export const EnvVariableForm: React.FC<EnvVariableFormProps> = ({ onSave, loading }) => {
  const [entries, setEntries] = useState<EnvEntry[]>([{ name: '', value: '', id: '1' }]);
  const [password, setPassword] = useState('');

  const addEntry = () => {
    const newId = Date.now().toString();
    setEntries([...entries, { name: '', value: '', id: newId }]);
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

    await onSave(validEntries, password);
    setEntries([{ name: '', value: '', id: '1' }]);
    setPassword('');
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Add Environment Variables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-gray-300 text-sm">Variable Name</Label>
                  <Input
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id!, 'name', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key == ' ') {
                        e.preventDefault();            
                      }
                    }}
                    placeholder="API_KEY"
                    className="bg-gray-800 border-gray-600 text-white font-mono"
                    required
                    autoComplete='off'
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-gray-300 text-sm">Value</Label>
                  <Input
                    value={entry.value}
                    onChange={(e) => updateEntry(entry.id!, 'value', e.target.value)}
                    placeholder="your-secret-value"
                    type="password"
                    className="bg-gray-800 border-gray-600 text-white font-mono"
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
                  className="border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Variable
          </Button>

          <div className="border-t border-gray-700 pt-4">
            <Label className="text-gray-300 text-sm">Project Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter project password to encrypt variables"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This password was set when you created the project and is used to encrypt your environment variables.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !password.trim() || entries.every(e => !e.name.trim() || !e.value.trim())}
            className="w-full bg-green-600 hover:bg-green-700"
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

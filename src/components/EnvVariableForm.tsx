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
    <Card className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="mr-2 h-5 w-5 text-purple-400" />
          Add Environment Variables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex flex-col sm:flex-row gap-3 items-end bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-xl p-3 border border-purple-800">
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

          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="w-full border-purple-800 text-gray-900 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-blue-900/20 hover:text-white rounded-lg transition"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Variable
          </Button>

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
            disabled={loading || !password.trim() || entries.every(e => !e.name.trim() || !e.value.trim())}
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

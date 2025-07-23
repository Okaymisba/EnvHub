import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const OneTimePassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      if (!token) {
        setError('No token provided');
        setIsLoading(false);
        return;
      }

      try {
        // First, fetch the secret
        const { data, error: fetchError } = await supabase
          .from('secrets')
          .select('encoded_password, views, max_views, expires_at')
          .eq('token', token)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Invalid or expired token');

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          throw new Error('This link has expired');
        }

        if (data.max_views && data.views >= data.max_views) {
          throw new Error('Maximum views for this secret have been reached');
        }

        // Use RPC to update the view count
        const { error: updateError } = await supabase
          .rpc('increment_secret_views', { secret_token: token });

        if (updateError) {
          console.warn('Could not update view count:', updateError);
          // Continue even if view count update fails
        }

        setPassword(atob(data.encoded_password));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch password');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassword();
  }, [token]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Password copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4">
        <Card className="w-full max-w-md bg-black border-red-500/30">
          <CardHeader>
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-center text-white">Error</CardTitle>
            <CardDescription className="text-center text-red-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')} variant="outline" className="border-purple-500 text-purple-500">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-center text-white">Your Password</CardTitle>
          <CardDescription className="text-center text-gray-400">
            This password will be shown only once. Please copy it to a secure location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg mb-6">
            <code className="text-lg font-mono text-gray-100 break-all">
              {password}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="ml-2 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full bg-black border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneTimePassword;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export const CLISetup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.app_metadata?.provider !== 'google') {
        navigate('/');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [navigate]);

  const handleSetupCLI = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast({
        title: 'Check your email',
        description: 'We\'ve sent you a password reset link. Please check your inbox to set up your CLI password.',
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-x-hidden p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <Card className="w-full max-w-md bg-black/90 border border-purple-900 shadow-xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          {/* SVG Lock Logo */}
          <div className="mx-auto w-14 h-14 flex items-center justify-center mb-4 shadow-2xl bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl">
            <Terminal className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            CLI Access Setup
          </CardTitle>
          <CardDescription className="text-slate-400">
            Set up your CLI access by creating a password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>

          <Button
            onClick={handleSetupCLI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? 'Sending email...' : 'Send Password Reset Email'}
          </Button>

          <div className="text-center">
            <span className="text-slate-400">Back to </span>
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Dashboard
            </button>
          </div>

          {/* Terms and Privacy Links */}
          <div className="text-center text-xs text-slate-500 space-y-1 mt-6">
            <p>By continuing, you agree to our</p>
            <div className="space-x-4">
              <Link
                to="/terms"
                className="text-slate-400 hover:text-white underline underline-offset-2"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-white underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CLISetup;

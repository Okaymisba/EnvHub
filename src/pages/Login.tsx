// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ForgotPassword } from '@/components/ForgotPassword';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'An error occurred during login');
        return;
      }

      if (data.user) {
        toast.success('Successfully logged in!');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google auth error:', error);
        toast.error(error.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-x-hidden p-4">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        <style>{`
          .animate-pulse-slow {
            animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3;}
            50% { opacity: 0.6;}
          }
        `}</style>
      </div>
    );
  }

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
            <svg width="40" height="40" viewBox="0 0 56 56" fill="none" className="mx-auto">
              <rect width="56" height="56" rx="16" fill="url(#paint0_linear)" />
              <path d="M18 26V20C18 15.58 21.58 12 26 12C30.42 12 34 15.58 34 20V26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="14" y="26" width="28" height="18" rx="6" stroke="#fff" strokeWidth="2.5" />
              <circle cx="28" cy="35" r="3" fill="#fff" />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your EnvHub account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            disabled={loading}
            variant="outline"
            className="w-full bg-black text-white border-gray-800 hover:bg-gray-100 hover:border-gray-700 transition-colors duration-200"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-slate-400 hover:text-white text-sm p-0 h-auto"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-slate-400">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Sign up
            </Link>
          </div>

          {/* Terms and Privacy Links */}
          <div className="text-center text-xs text-slate-500 space-y-1">
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
      <style>{`
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3;}
          50% { opacity: 0.6;}
        }
      `}</style>
    </div>
  );
}
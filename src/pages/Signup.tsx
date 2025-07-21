// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {FcGoogle} from "react-icons/fc";
import { Check, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isMatching = confirmPassword === pass;
    
    const isValid = minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isMatching;
    setIsPasswordValid(isValid);
    
    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    if (confirmPassword && !isMatching) return 'Passwords do not match';
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordError(validatePassword(password));
  };

  const isFormValid = () => {
    const isEmailValid = email && email.includes('@');
    const isPasswordFilled = password.length > 0;
    const isConfirmPasswordMatching = password === confirmPassword && confirmPassword.length > 0;

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

    return isEmailValid && isPasswordValid && isConfirmPasswordMatching;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'An error occurred during signup');
        return;
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
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
          <div className="flex justify-center mb-4">
            <img
                src="/favicon.ico"
                alt="EnvHub Logo"
                className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Join EnvHub for secure environment management
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

          <form onSubmit={handleSignup} className="space-y-4">
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="bg-black/80 border-slate-700 text-white placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {password.length >= 8 && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>8+ characters</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {/[A-Z]/.test(password) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>Uppercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {/[a-z]/.test(password) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>Lowercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {/\d/.test(password) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={/\d/.test(password) ? 'text-green-400' : 'text-gray-400'}>Number</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 flex items-center justify-center rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-gray-400'}>Special character</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`bg-black/80 border-slate-700 text-white placeholder:text-slate-400 pr-10 ${
                    confirmPassword && password === confirmPassword ? 'border-green-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="flex items-center text-red-400 text-sm">
                  <XCircle className="h-4 w-4 mr-1" />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full ${
                isFormValid() 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-slate-400">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Sign in
            </Link>
          </div>

          {/* Terms and Privacy Links */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>By creating an account, you agree to our</p>
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
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  GitBranch, 
  Github, 
  BookOpen, 
  DollarSign, 
  Info, 
  Mail 
} from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { SupabaseService } from '@/services/supabaseService';
import { supabase } from "@/integrations/supabase/client";


export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isDocsPage = location.pathname.startsWith('/docs');

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      try {
        const { data } = await SupabaseService.getCurrentUser();
        setUser(data?.user || null);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const navItems = [
    { 
      label: 'Docs', 
      path: '/docs',
      icon: <BookOpen className="w-4 h-4" />
    },
    { 
      label: 'Pricing', 
      path: '/pricing',
      icon: <DollarSign className="w-4 h-4" />
    },
    { 
      label: 'About', 
      path: '/about',
      icon: <Info className="w-4 h-4" />
    },
    { 
      label: 'Contact', 
      path: '/contact',
      icon: <Mail className="w-4 h-4" />
    },
    {
      label: 'GitHub',
      path: 'https://github.com/Okaymisba/EnvHub',
      icon: <Github className="w-4 h-4" />
    }
  ];

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <GitBranch className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">EnvHub</span>
          </div>

          {/* Desktop Navigation */}
          {!user && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.path.startsWith('http')) {
                      window.open(item.path, '_blank');
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isDocsPage && user ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-gray-800">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path.startsWith('http')) {
                    window.open(item.path, '_blank');
                  } else {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }
                }}
                className="text-gray-300 hover:bg-gray-800 hover:text-white block w-full text-left px-4 py-2 rounded-md text-base font-medium flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="pt-4 space-y-3">
              {isDocsPage && user ? (
                <div className="px-3 py-2">
                  <ProfileDropdown user={user} onLogout={handleLogout} />
                </div>
              ) : (
                <Button
                  onClick={() => {
                    handleGetStarted();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                >
                  {user ? 'Dashboard' : 'Get Started'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
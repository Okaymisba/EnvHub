// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X,
  BookOpen, 
  DollarSign, 
  Info, 
  Mail,
  Newspaper,
  PlayCircle
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
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
        const user = await SupabaseService.getCurrentUser();
        setUser(user || null);
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
    navigate('/signup');
  };

  const navItems = [
    { 
      label: 'Documentation', 
      path: '/docs',
      icon: <BookOpen className="w-4 h-4" />
    },
    { 
      label: 'Pricing', 
      path: '/pricing',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      label: 'GitHub',
      path: 'https://github.com/Okaymisba/EnvHub',
      icon: <FaGithub className="w-4 h-4" />
    },
    {
      label: 'Demo',
      path: 'https://www.youtube.com/watch?v=q3cveL8kY1k',
      icon: <PlayCircle className="w-4 h-4" />,
      isExternal: true
    },
    {
      label: 'Blog',
      path: '/blog',
      icon: <Newspaper className="w-4 h-4" />
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: <Mail className="w-4 h-4" />
    },
    {
      label: 'About',
      path: '/about',
      icon: <Info className="w-4 h-4" />
    }
  ];

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="/favicon.ico"
                alt="EnvHub Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="text-2xl font-bold text-white">EnvHub</span>
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
              {user ? (
                <ProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                >
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {user ? (
                <ProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        />
        
        {/* Menu */}
        <div 
          className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-md border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto py-6 px-4 space-y-4">
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
                className="text-gray-300 hover:bg-gray-800 hover:text-white block w-full text-left px-4 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors duration-200"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleGetStarted();
                setIsMenuOpen(false);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium block w-full text-center px-4 py-3 rounded-md text-base transition-colors duration-200 mt-4"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
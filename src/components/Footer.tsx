// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-gray-800 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Company Info */}
          <div className="col-span-2 space-y-4 lg:col-span-2">
            <h3 className="text-white text-lg font-semibold">EnvHub</h3>
            <p className="text-sm">Secure environment variable management for modern development teams.</p>
            <div className="flex space-x-4">
              <a href="https://github.com/envhub" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => navigate('/pricing')} className="text-sm hover:text-white transition-colors">Pricing</button></li>
              <li><button onClick={() => navigate('/docs')} className="text-sm hover:text-white transition-colors">Documentation</button></li>
              {/*<li><a href="#changelog" className="text-sm hover:text-white transition-colors">Changelog</a></li>*/}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => navigate('/about')} className="text-sm hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/contact')} className="text-sm hover:text-white transition-colors">Contact</button></li>
              {/*<li><a href="#careers" className="text-sm hover:text-white transition-colors">Careers</a></li>*/}
              {/*<li><a href="#blog" className="text-sm hover:text-white transition-colors">Blog</a></li>*/}
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://github.com/Okaymisba/EnvHub/discussions/categories/q-a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors flex items-center"
                >
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <a
                    href="https://github.com/Okaymisba/EnvHub/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors flex items-center"
                >
                  <span>Report a Problem</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Okaymisba/EnvHub/discussions/categories/ideas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors flex items-center"
                >
                  <span>Feature Request</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Okaymisba/EnvHub/discussions/categories/show-and-tell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors flex items-center"
                >
                  <span>Show and Tell</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><button onClick={() => navigate('/privacy')} className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/terms')} className="text-sm hover:text-white transition-colors">Terms of Service</button></li>
              {/*<li><a href="#security" className="text-sm hover:text-white transition-colors">Security</a></li>*/}
              {/*<li><a href="#cookies" className="text-sm hover:text-white transition-colors">Cookie Policy</a></li>*/}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} EnvHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

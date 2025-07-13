
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-800 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400"> 2025 EnvHub</p>
        <div className="flex gap-8">
          <button onClick={() => navigate('/pricing')} className="text-gray-400 hover:text-purple-400 transition-colors">
            Pricing
          </button>
          <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-purple-400 transition-colors">
            Privacy
          </button>
          <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-purple-400 transition-colors">
            Terms
          </button>
          <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-purple-400 transition-colors">
            About us
          </button>
        </div>
      </div>
    </footer>
  );
};

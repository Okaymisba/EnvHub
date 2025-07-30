import React, { useState, useEffect } from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export const OpenSourceSection = () => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Okaymisba/EnvHub');
        if (!response.ok) throw new Error('Failed to fetch repository data');
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching stars:', error);
      }
    };

    fetchStars();
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Open Source & Community-Driven
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            EnvHub is built on transparency and community collaboration. Join thousands of developers who trust us with their environment variables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* GitHub Stats */}
          <a
              href="https://github.com/okaymisba/EnvHub"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
          >
          <div className="relative overflow-hidden bg-black rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
            <FaGithub className="w-10 h-10 mx-auto mb-4 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />

            <h3 className="text-2xl font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-gray-300">
              {stars} Stars
            </h3>

            <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
              Join our growing community
            </p>
          </div>
          </a>


          {/* Security */}
          <a
              href="https://github.com/okaymisba/EnvHub"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
          >
            <div className="relative overflow-hidden bg-black rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer">
              <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <h3 className="text-2xl font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-gray-300">
                Transparent Security
              </h3>
              <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                MPL 2.0 License - Open for audit
              </p>
            </div>
          </a>

          {/* Global Access */}
          <a
              href="https://github.com/okaymisba/EnvHub"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
          >
            <div className="relative overflow-hidden bg-black rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group cursor-pointer">
              <Globe className="w-10 h-10 mx-auto mb-4 text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <h3 className="text-2xl font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-gray-300">
                Global Access
              </h3>
              <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                Available on GitHub
              </p>
            </div>
          </a>

        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/Okaymisba/EnvHub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-gray rounded-lg hover:opacity-90 transition-opacity"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

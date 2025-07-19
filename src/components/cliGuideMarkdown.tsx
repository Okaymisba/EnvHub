// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {Copy} from "lucide-react";
import { Project } from "@/types/project";

interface CLIGuideProps {
  project: Project;
}

export const CLIGuide: React.FC<CLIGuideProps> = ({ project }) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6 text-gray-300">
            <h2 className="text-xl font-bold text-white">CLI Usage Guide for {project.name}</h2>
            <p>
                EnvHub CLI provides a secure way to manage your environment variables for <span className="text-purple-300">{project.name}</span> directly from your terminal.
                It supports encryption and seamless integration with your development workflow.
            </p>

            <h3 className="text-lg font-semibold text-white">Installation</h3>
            <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
        <button
            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
            onClick={() => copyToClipboard('pip install envhub-cli')}
        >
          <Copy className="w-4 h-4"/>
        </button>
        <code>pip install envhub-cli</code>
      </pre>
            <p>Or if your environment is externally managed, use the following command:</p>
            <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
        <button
            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
            onClick={() => copyToClipboard('pipx install envhub-cli')}
        >
          <Copy className="w-4 h-4"/>
        </button>
        <code>pipx install envhub-cli</code>
                </pre>
            
            <h3 className="text-lg font-semibold text-white">Basic Commands</h3>

            <div className="space-y-4">
                <div>
                    <p className="font-semibold text-purple-400">1. Login to EnvHub</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                                <button
                                    className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                                    onClick={() => copyToClipboard('envhub login')}
                                >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub login
# You will be prompted for:
# - Email
# - Password (hidden input)`}</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">2. Clone this project</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard(`envhub clone ${project.name}`)}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>envhub clone {project.name}</code>
          </pre>
                    <p className="text-sm text-gray-400 mt-1">
                        This will create a <code className="bg-purple-900/30 px-1 py-0.5 rounded">.env</code> <code className="bg-purple-900/30 px-1 py-0.5 rounded">.envhub</code> and <code className="bg-purple-900/30 px-1 py-0.5 rounded">.gitignore</code> files in your current directory with the latest environment variables.
                    </p>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">3. List environment variables</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub list')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub list  
# Shows all variables for ${project.name}`}</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">4. Add new environment variable</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub add')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub add
# You'll be prompted for:
# - Variable name
# - Variable value (hidden input)`}</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">5. Pull latest changes</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub pull')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub pull  
# Updates your local .env with the latest changes`}</code>
          </pre>
                </div>
            </div>

            <div className="mt-8 group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/20 p-0.5 shadow-lg transition-all duration-300 hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative rounded-[11px] bg-gradient-to-br from-gray-900 to-gray-950 p-6 backdrop-blur-sm">
                    <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-purple-600/20 blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-blue-600/20 blur-2xl" />
                    
                    <div className="relative z-10">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" x2="12.01" y1="17" y2="17"></line>
                                </svg>
                            </div>
                            <h3 className="bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
                                Need Help?
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-gray-300">
                                For detailed documentation and guides, visit our 
                                <a 
                                    href="/docs" 
                                    className="ml-1 font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-purple-400/50"
                                >
                                    documentation page
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 inline-block h-3 w-3 -translate-y-0.5 transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </a>.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a 
                                    href="https://github.com/Okaymisba/envhub/issues"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 rounded-full bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                    </svg>
                                    Report an issue
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

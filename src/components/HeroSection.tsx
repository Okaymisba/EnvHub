// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from './ui/button';
import {AlertTriangle, ArrowRight, Lock, Shield} from 'lucide-react';

interface HeroSectionProps {
    onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({onGetStarted}) => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden bg-black min-h-[80vh] flex items-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Top decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
                    {/* Floating orbs */}
                    <div
                        className="absolute top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
                    <div
                        className="absolute top-10 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-2000"></div>

                    {/* Subtle grid overlay */}
                    <div
                        className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e2e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03]"></div>

                    {/* Diagonal accent lines */}
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_65%,rgba(139,92,246,0.05)_65%,rgba(139,92,246,0.1)_70%,transparent_70%)]"></div>
                </div>

                {/* Original bottom elements */}
                <div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <div
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full border border-slate-800">
                                <Shield className="w-5 h-5"/>
                                <span className="text-sm font-medium">Secure Environment Variables</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Never worry about <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">leaked secrets</span> again
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Secure your environment variables with military-grade encryption and prevent accidental
                            exposure in your codebase.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                onClick={onGetStarted}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                            >
                                Get Started for Free
                                <ArrowRight className="w-5 h-5"/>
                            </Button>
                            <Button
                                variant="outline"
                                className="border-2 border-slate-700 text-white bg-slate-900/50 hover:bg-slate-800/70 hover:text-white px-8 py-6 text-lg font-medium transition-all duration-200"
                                onClick={() => window.scrollTo({
                                    top: document.getElementById('features')?.offsetTop,
                                    behavior: 'smooth'
                                })}
                            >
                                Learn More
                            </Button>
                        </div>

                        <div className="mt-8 text-sm text-gray-400">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-green-400"/>
                                    <span>End-to-end encryption</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400"/>
                                    <span>Enterprise-grade security</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400"/>
                                    <span>Leak detection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                            className="relative z-10 bg-black/80 backdrop-blur-sm rounded-xl p-1 border border-slate-800 shadow-2xl">
                            <div className="bg-black rounded-lg overflow-hidden border border-slate-800">
                                <div className="bg-black p-3 flex items-center border-b border-slate-800">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-slate-400 ml-4">.env</div>
                                </div>
                                <div className="p-6 font-mono text-sm text-slate-300">
                                    <div className="text-blue-400"># Environment Variables (Securely Encrypted)</div>
                                    <div className="mt-4">
                                        <div><span className="text-purple-400">DATABASE_URL</span>=<span
                                            className="text-green-400">BxKOsfB7tiBOtmFP/r1w1GKWtT5V1rEkRIIZ5wkIK7nQ2</span>
                                        </div>
                                        <div className="mt-2"><span className="text-purple-400">STRIPE_KEY</span>=<span
                                            className="text-green-400">JqS4ghtfz1hhYm0O4uH4G+zE</span></div>
                                        <div className="mt-2"><span className="text-purple-400">JWT_SECRET</span>=<span
                                            className="text-green-400">4mJCmc0c7TAj</span></div>
                                        <div className="mt-2"><span className="text-purple-400">NODE_ENV</span>=<span
                                            className="text-green-400">1B4A7io=</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute -inset-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl opacity-40 blur-xl -z-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {AlertTriangle, ArrowRight, Lock, Shield, Zap} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

interface StatCardProps {
    value: string;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    delay: number;
}

const AnimatedCounter: React.FC<{ value: string }> = ({value}) => {
    const [count, setCount] = useState(0);
    const target = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);

            if (frame === totalFrames) {
                clearInterval(counter);
            }

            setCount(currentCount);
        }, frameDuration);

        return () => clearInterval(counter);
    }, [target, totalFrames]);

    return (
        <span
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </span>
    );
};

const StatCard: React.FC<StatCardProps> = ({value, label, sublabel, icon: Icon, color, delay}) => {
    return (
        <div
            className="relative p-6 rounded-2xl bg-gradient-to-br bg-black backdrop-blur-sm hover:border-slate-700/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`}/>
            </div>
            <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                    <AnimatedCounter value={value}/>
                </div>
                <h3 className="text-lg font-semibold text-white">{label}</h3>
                <p className="text-sm text-slate-400">{sublabel}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl border border-slate-700/50 pointer-events-none"></div>
        </div>
    );
};

interface StatsSectionProps {
    onGetStarted: () => void;
}

export const StatsSection: React.FC<StatsSectionProps> = ({onGetStarted}) => {
    const navigate = useNavigate();

    const stats = [
        {
            value: "3.25M",
            label: "Secrets Leaked Monthly",
            sublabel: "On public GitHub repositories (2024)",
            icon: AlertTriangle,
            color: "text-red-400"
        },
        {
            value: "1.07M",
            label: "Auth Keys Exposed",
            sublabel: "Detected by GitGuardian (2023)",
            icon: Lock,
            color: "text-blue-400"
        },
        {
            value: "46K+",
            label: "OpenAI API Keys",
            sublabel: "Exposed monthly (1,212% increase)",
            icon: Zap,
            color: "text-yellow-400"
        },
        {
            value: "83%",
            label: "Organizations at Risk",
            sublabel: "With exposed credentials in 2024",
            icon: Shield,
            color: "text-purple-400"
        }
    ];

    return (
        <section className="relative py-10 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
                <div
                    className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        The Growing Threat of
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 ml-3">
              Secret Sprawl
            </span>
                    </h2>
                    <p className="text-xl text-slate-300">
                        Organizations are losing millions to exposed credentials. Don't be the next victim.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            value={stat.value}
                            label={stat.label}
                            sublabel={stat.sublabel}
                            icon={stat.icon}
                            color={stat.color}
                            delay={index * 100}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        onClick={onGetStarted}
                        className="group relative overflow-hidden px-8 py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
            <span className="relative z-10 flex items-center">
              Secure Your Secrets Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </span>
                        <span
                            className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                </div>
            </div>
        </section>
    );
};

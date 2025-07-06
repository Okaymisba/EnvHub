import {Link} from 'react-router-dom';
import {GitBranch, Lock, Shield} from 'lucide-react';
import {Helmet} from "react-helmet-async";
import React from "react";

export default function AboutUs() {
    return (
        <>
            <Helmet>
                <title>About Us - EnvHub</title>
                <meta
                    name="description"
                    content="Secure, Simple, and Scalable Environment Variable Management"
                />
                <meta name="keywords" content="EnvHub, Environment Variables, Secure, Simple, Scalable"/>
                <meta name="robots" content="index, follow"/>
                <meta name="author" content="EnvHub Team"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="url" content="https://envhub.net/about"/>

                { /* Open Graph */ }
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://envhub.net/about"/>
                <meta property="og:title" content="About Us - EnvHub"/>
                <meta
                    property="og:description"
                    content="Secure and simple environment variables management for developers and teams."
                />
                <meta property="og:image" content="https://envhub.net/opengraph-image.png"/>

                { /* Twitter */ }
                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:url" content="https://envhub.net/about"/>
                <meta property="twitter:title" content="About Us - EnvHub"/>
                <meta
                    property="twitter:description"
                    content="Secure and simple environment variables management for developers and teams."
                />
                <meta property="twitter:image" content="https://envhub.net/opengraph-image.png"/>

            </Helmet>

            <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div
                        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div
                        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <GitBranch className="w-8 h-8 text-purple-400"/>
                            <span className="text-lg text-gray-400 font-medium">About EnvHub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Secure, Simple, and <span
                            className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">Scalable</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Environment variable management made secure and straightforward
                        </p>
                    </div>

                    <div className="space-y-16">
                        <section className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                At EnvHub, we believe in making environment variable management as secure and
                                straightforward as possible.
                                Our mission is to provide developers with the tools they need to manage their
                                application configurations
                                without compromising on security or ease of use.
                            </p>
                        </section>

                        <section className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                            <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                                <p>
                                    Founded in 2025, EnvHub was born out of frustration with existing environment
                                    variable management solutions.
                                    We saw a need for a more developer-friendly approach that didn't sacrifice security
                                    for convenience.
                                </p>
                            </div>
                        </section>

                        <section className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800">
                            <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">Security First</h3>
                                        <p className="text-gray-400">We prioritize the security of your sensitive data
                                            above all else.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">Developer Experience</h3>
                                        <p className="text-gray-400">We build tools that we want to use ourselves.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-red-500 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">Transparency</h3>
                                        <p className="text-gray-400">We believe in being open about how we handle your
                                            data.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers who trust EnvHub with their environment variables.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            Sign up for free
                            <Shield className="ml-2 w-5 h-5"/>
                        </Link>
                        <div className="mt-8 text-sm text-gray-500">
                            <Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy
                                Policy</Link>
                            <span className="mx-3">•</span>
                            <Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of
                                Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

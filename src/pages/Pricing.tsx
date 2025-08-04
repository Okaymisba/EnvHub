// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar.tsx";
import {Footer} from "@/components/Footer.tsx";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '10 projects', included: true },
        { text: '20 environment variables per project', included: true },
        { text: 'Up to 3 members per project (Including you)', included: true },
        { text: 'Full CLI access', included: true},
        { text: 'Role-based access control', included: true },
        { text: 'Community support only', included: true },
        { text: 'Ads will be shown', included: false },
      ],
      buttonText: 'Get Started Free',
      popular: false,
      buttonVariant: 'outline' as const
    },
    {
      name: 'Pro',
      price: '$5',
      period: 'per month',
      description: 'Great for individual developers',
      features: [
        { text: '250 projects', included: true },
        { text: '50 env variables per project', included: true },
        { text: 'Up to 10 members per project (Including you)', included: true },
        { text: 'Full CLI access', included: true },
        { text: 'Role-based access control', included: true },
        { text: 'Priority email support', included: true },
        { text: 'No ads', included: true },
      ],
      buttonText: 'Start Pro Trial',
      popular: true,
      buttonVariant: 'default' as const
    },
    {
      name: 'Team',
      price: '$20',
      period: 'per month',
      description: 'Perfect for growing teams',
      features: [
        { text: '1000 projects', included: true },
        { text: '100 env variables per project', included: true },
        { text: 'Up to 20 members per project (Including you)', included: true },
        { text: 'Full CLI access', included: true },
        { text: 'Role-based access control', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'No ads', included: true },
      ],
      buttonText: 'Start Team Trial',
      popular: false,
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - EnvHub</title>
        <meta 
          name="description" 
          content="Choose the perfect plan for your environment variable management needs. Free and Pro plans available with different features and limits."
        />
        <meta name="keywords" content="envhub pricing, environment variables pricing, secrets management cost, .env management pricing, secure config pricing"/>
        <meta name="robots" content="index, follow"/>
        <meta name="author" content="EnvHub Team"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="url" content="https://envhub.net/pricing"/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://envhub.net/pricing"/>
        <meta property="og:title" content="Pricing - EnvHub"/>
        <meta 
          property="og:description" 
          content="Choose the perfect plan for your environment variable management needs. Free and Pro plans available."
        />
        <meta property="og:image" content="https://envhub.net/opengraph-pricing.png"/>

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://envhub.net/pricing"/>
        <meta property="twitter:title" content="Pricing - EnvHub"/>
        <meta 
          property="twitter:description" 
          content="Choose the perfect plan for your environment variable management needs. Free and Pro plans available."
        />
        <meta property="twitter:image" content="https://envhub.net/opengraph-pricing.png"/>

      </Helmet>

      <Navbar />
      <div className="min-h-screen pt-16 bg-black text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        </div>
        {/*/!* Header *!/*/}
        {/*<div className="border-b border-gray-800">*/}
        {/*  <div className="flex items-center justify-between p-6">*/}
        {/*    <div className="flex items-center">*/}
        {/*      <button*/}
        {/*        onClick={() => navigate('/')}*/}
        {/*        className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent ml-2"*/}
        {/*      >*/}
        {/*        EnvHub*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free, upgrade when you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative bg-black border-2 transition-all duration-300 hover:scale-105 ${plan.popular
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
                  : 'border-slate-700 hover:border-slate-600'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
                          {feature.text}
                        </span>
                        {/*{feature.tooltip && (*/}
                        {/*  <div className="group relative">*/}
                        {/*    <Info className="w-4 h-4 text-gray-500 cursor-help" />*/}
                        {/*    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">*/}
                        {/*      {feature.tooltip}*/}
                        {/*      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>*/}
                        {/*    </div>*/}
                        {/*  </div>*/}
                        {/*)}*/}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 font-semibold ${plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : ''
                      }`}
                    variant={plan.buttonVariant}
                    onClick={() => navigate('/signup')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-gray-400">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What happens if I exceed my limits?
                  </h3>
                  <p className="text-gray-400">
                    You'll be charged according to our transparent overage rates. No surprises, just predictable scaling.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Is there a free trial for paid plans?
                  </h3>
                  <p className="text-gray-400">
                    Nope! there is no free trial for paid plans.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Do you offer discounts for annual billing?
                  </h3>
                  <p className="text-gray-400">
                    No, there is no annual billing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to secure your environment variables?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust EnvHub with their secrets.
            </p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold"
            >
              Get Started Free
            </Button>
          </div>
        </div>
        <footer className="w-full mt-auto">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Pricing;

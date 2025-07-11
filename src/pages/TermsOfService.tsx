// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-900/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <Helmet>
        <title>Terms and Conditions - EnvHub</title>
        <meta name="description" content="Terms of Service for EnvHub" />
      </Helmet>
      
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-gray-400 mt-4">Effective Date: July 11, 2025</p>
          </motion.div>

          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-gray-800/50">
              <CardTitle className="text-2xl font-bold text-gray-300 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-400" />
                Welcome to EnvHub
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <motion.div 
                variants={containerVariants}
                className="prose prose-invert max-w-none space-y-8 text-gray-200"
              >
                <motion.section variants={itemVariants} className="text-gray-200">
                  <p className="text-gray-200">Welcome to EnvHub. These Terms and Conditions govern your use of our website located at <a href="https://envhub.net/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://envhub.net/</a> operated by EnvHub.</p>
                  <p className="text-gray-200">By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">1. Use of Service</h2>
                  <p className="text-gray-200">You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-200">
                    <li className="text-gray-200">In any way that violates any applicable national or international law or regulation</li>
                    <li className="text-gray-200">For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</li>
                    <li className="text-gray-200">To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                    <li className="text-gray-200">To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                  </ul>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">2. Intellectual Property</h2>
                  <p className="text-gray-200">The Service and its original content, features, and functionality are and will remain the exclusive property of EnvHub and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">3. User Content</h2>
                  <p className="text-gray-200">Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">4. Prohibited Activities</h2>
                  <p className="text-gray-200">You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                  <p className="text-gray-200 mt-4">Automated misuse, including the use of bots, scripts, or other automated methods to access or interact with this Service, is strictly prohibited without our prior written consent.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">5. Termination</h2>
                  <p className="text-gray-200">We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">6. Limitation of Liability</h2>
                  <p className="text-gray-200">In no event shall EnvHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">7. Disclaimer</h2>
                  <p className="text-gray-200">Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">8. Governing Law</h2>
                  <p className="text-gray-200">These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">9. Changes to Terms</h2>
                  <p className="text-gray-200">We reserve the right, at our sole discretion, to modify or replace these Terms at any time without prior notice. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">10. Cookies</h2>
                  <p className="text-gray-200">We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more information about how we use cookies, please refer to our <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">11. Third-Party Advertising</h2>
                  <p className="text-gray-200">We may use third-party advertising companies to serve ads when you visit our Service. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. This information is collected anonymously through the use of cookies and similar technologies.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">12. Contact Us</h2>
                  <p className="text-gray-200">If you have any questions about these Terms, please contact us at <a href="mailto:msbahsarfaraz@gmail.com" className="text-blue-400 hover:underline">msbahsarfaraz@gmail.com</a>.</p>
                </motion.section>
              </motion.div>
            </CardContent>
          </Card>

          <motion.div 
            variants={itemVariants}
            className="text-center text-gray-400 text-sm mt-12 pt-6 border-t border-gray-800/50"
          >
            <p> 2025 EnvHub. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
        <title>Privacy Policy - EnvHub</title>
        <meta name="description" content="Privacy Policy for EnvHub" />
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
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            <p className="text-gray-400 mt-4">Last updated: July 11, 2025</p>
          </motion.div>

          <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-gray-800/50">
              <CardTitle className="text-2xl font-bold text-gray-300 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <motion.div 
                variants={containerVariants}
                className="prose prose-invert max-w-none space-y-8 text-gray-200"
              >
                <motion.section variants={itemVariants} className="text-gray-200">
                  <p className="text-gray-200">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                  <p className="text-gray-200">We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-gray-800/50">1. Interpretation and Definitions</h2>
                  <h3 className="text-xl font-semibold text-gray-300 mt-6 mb-3">Interpretation</h3>
                  <p className="text-gray-200">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                  
                  <h3 className="text-xl font-semibold text-gray-300 mt-8 mb-3">Definitions</h3>
                  <p className="text-gray-200">For the purposes of this Privacy Policy:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-200">
                    <li className="text-gray-200"><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                    <li className="text-gray-200"><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to EnvHub.</li>
                    <li className="text-gray-200"><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website.</li>
                    <li className="text-gray-200"><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
                    <li className="text-gray-200"><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                    <li className="text-gray-200"><strong>Service</strong> refers to the Website.</li>
                    <li className="text-gray-200"><strong>Website</strong> refers to EnvHub, accessible from <a href="https://envhub.net/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://envhub.net/</a></li>
                  </ul>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">2. Collecting and Using Your Personal Data</h2>
                  <h3 className="text-xl font-semibold text-gray-300 mt-6 mb-3">Types of Data Collected</h3>
                  
                  <h4 className="text-lg font-medium text-gray-300 mt-4 mb-2">Personal Data</h4>
                  <p className="text-gray-200">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. This may include:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-200">
                    <li className="text-gray-200">Email address</li>
                    <li className="text-gray-200">Usage Data</li>
                  </ul>

                  <h4 className="text-lg font-medium text-gray-300 mt-6 mb-2">Usage Data</h4>
                  <p className="text-gray-200">Usage Data is collected automatically when using the Service and may include information such as Your Device's Internet Protocol address, browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, and other diagnostic data.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">3. Use of Your Personal Data</h2>
                  <p className="text-gray-200">The Company may use Personal Data for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-200">
                    <li className="text-gray-200"><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                    <li className="text-gray-200"><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                    <li className="text-gray-200"><strong>To contact You:</strong> To contact You by email or other equivalent forms of electronic communication.</li>
                    <li className="text-gray-200"><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, or other sale or transfer of some or all of Our assets.</li>
                  </ul>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">4. Security of Your Personal Data</h2>
                  <p className="text-gray-200">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
                </motion.section>

                <motion.section variants={itemVariants} className="text-gray-200">
                  <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-gray-800/50">5. Contact Us</h2>
                  <p className="text-gray-200">If you have any questions about this Privacy Policy, You can contact us:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-200">
                    <li className="text-gray-200">By email: <a href="mailto:msbahsarfaraz@gmail.com" className="text-blue-400 hover:underline">msbahsarfaraz@gmail.com</a></li>
                    <li className="text-gray-200">By visiting this page on our website: <a href="https://envhub.net/contact" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://envhub.net/contact</a></li>
                  </ul>
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

export default PrivacyPolicy;

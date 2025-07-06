import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Privacy Policy - EnvHub</title>
        <meta 
          name="description" 
          content="Read EnvHub's Privacy Policy to understand how we collect, use, and protect your data when you use our environment variables management service."
        />
        <meta name="keywords" content="privacy policy, data protection, environment variables security, EnvHub privacy, data security"/>
        <meta name="robots" content="index, follow"/>
        <meta name="author" content="EnvHub Team"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://envhub.net/privacy"/>
        <meta property="og:title" content="Privacy Policy - EnvHub"/>
        <meta 
          property="og:description" 
          content="Learn how EnvHub protects your data and respects your privacy while providing secure environment variables management."
        />
        <meta property="og:image" content="https://envhub.net/opengraph-privacy.png"/>

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://envhub.net/privacy"/>
        <meta property="twitter:title" content="Privacy Policy - EnvHub"/>
        <meta 
          property="twitter:description" 
          content="Learn how EnvHub protects your data and respects your privacy while providing secure environment variables management."
        />
        <meta property="twitter:image" content="https://envhub.net/opengraph-privacy.png"/>

      </Helmet>

      <div className="min-h-screen bg-black relative overflow-x-hidden p-4">
        <div className="max-w-4xl mx-auto py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="bg-black/80 border border-purple-900 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">Privacy Policy</CardTitle>
              <p className="text-slate-400">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p>
                  EnvHub collects minimal information necessary to provide our services. We collect your email address
                  for account creation and authentication purposes. Your environment variables and secrets are encrypted
                  end-to-end before storage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <p>
                  We use your email address solely for account management and service-related communications.
                  Your encrypted environment variables are stored securely and are never accessible to EnvHub staff.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
                <p>
                  All sensitive data is encrypted using industry-standard encryption before it leaves your device.
                  We implement multiple layers of security to protect your information, including secure transmission
                  protocols and encrypted storage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
                <p>
                  We do not sell, trade, or share your personal information with third parties. Your data remains
                  private and is only accessible to you and team members you explicitly invite to your projects.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
                <p>
                  You have the right to access, update, or delete your account and associated data at any time.
                  You can export your environment variables or permanently delete your account through our dashboard.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at msbahsarfaraz@gmail.com
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Cookies and Advertising</h2>
                <p>
                  We use cookies and similar technologies to improve your experience and deliver relevant advertising. EnvHub may display ads served by third-party vendors, including Google, which use cookies to serve ads based on your prior visits to this or other websites.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;

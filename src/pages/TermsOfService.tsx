
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-white hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Terms of Service</CardTitle>
            <p className="text-slate-400">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using EnvHub, you accept and agree to be bound by the terms and provisions
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
              <p>
                EnvHub provides secure environment variable and secrets management services. We offer encrypted
                storage, team collaboration features, and integration capabilities for development workflows.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account. You agree to use the service only for lawful purposes
                and in accordance with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data and Privacy</h2>
              <p>
                Your data privacy is paramount. We implement end-to-end encryption to ensure your sensitive
                information remains secure. Please refer to our Privacy Policy for detailed information about
                data handling practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Service Availability</h2>
              <p>
                While we strive to maintain high availability, we do not guarantee uninterrupted service.
                We may perform maintenance, updates, or experience technical issues that temporarily affect
                service availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
              <p>
                EnvHub shall not be liable for any direct, indirect, incidental, special, or consequential
                damages resulting from the use or inability to use the service, even if we have been advised
                of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
              <p>
                Either party may terminate this agreement at any time. Upon termination, your access to the
                service will cease, and you may request deletion of your data in accordance with our data
                retention policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Contact Information</h2>
              <p>
                For questions regarding these Terms of Service, please contact us at legal@envhub.dev
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;

import React from 'react';
import Layout from '@/Layout/Layout';
import { ScrollText } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <ScrollText className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        <div className="prose prose-green max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using LeafCare, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
            <p className="text-gray-600">
              LeafCare provides AI-powered plant disease detection and analysis services. We reserve the right to modify or discontinue any aspect of our services at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Provide accurate information when creating an account</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Not misuse or attempt to exploit the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600">
              LeafCare provides plant disease detection as a guidance tool. We are not responsible for any damages or losses resulting from reliance on our analysis.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
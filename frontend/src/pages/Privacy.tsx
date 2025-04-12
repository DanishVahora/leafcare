import React from 'react';
import Layout from '@/Layout/Layout';
import { Shield } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="prose prose-green max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            <p className="text-gray-600">
              We collect information that you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Account information (name, email, password)</li>
              <li>Plant images uploaded for disease detection</li>
              <li>Scan history and analysis results</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Provide and improve our disease detection services</li>
              <li>Personalize your experience</li>
              <li>Send important updates and notifications</li>
              <li>Analyze and improve our AI models</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information. Your data is encrypted and stored securely on our servers.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
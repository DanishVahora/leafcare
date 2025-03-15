import React from 'react';
import { Leaf, Github, Twitter, Linkedin, Camera, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingSubscribe } from '@/components/ui/FloatingSubscribe';

export const Footer: React.FC = () => {
  return (
    <div>
      <FloatingSubscribe />
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-green-600 to-emerald-600">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-green-800">LeafCare</span>
            </Link>
            <p className="text-sm md:text-base text-gray-600">
              Protecting your plants with AI-powered disease detection technology.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/detect" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>Disease Detection</span>
                </Link>
              </li>
              <li>
                <Link to="/docs" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Clock className="h-4 w-4" />
                  <span>Scan History</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-green-600 transition-colors text-sm md:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-green-600 transition-colors text-sm md:text-base">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all text-sm md:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 md:mt-12 pt-6 md:pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} LeafCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
};
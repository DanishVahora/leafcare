import React from 'react';
import { Leaf, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-semibold text-green-800">PlantCare</span>
            </div>
            <p className="text-gray-600">
              Protecting your plants with AI-powered disease detection technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-600"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-green-600"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-green-600"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} PlantCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
// components/Navbar.tsx
import React from 'react';
import { Leaf } from 'lucide-react';

interface NavbarProps {
  showFullMenu?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showFullMenu = true }) => {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <a href='/' className="text-xl font-semibold text-green-800">PlantCare</a>
          </div>
          {showFullMenu && (
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
              <a href="/auth" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

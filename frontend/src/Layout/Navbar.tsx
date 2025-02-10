import React, { useState } from 'react';
import { Leaf, LogOut, User as UserIcon } from 'lucide-react';
import { UseAuth } from '../context/AuthContext'; // Adjust the import path as needed

interface NavbarProps {
  showFullMenu?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showFullMenu = true }) => {
  const { user, logout } = UseAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <a href="/" className="text-xl font-semibold text-green-800">
              PlantCare
            </a>
          </div>

          {showFullMenu && (
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Contact
              </a>

              {user ? (
                // User Dropdown
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={user.photo || 'https://via.placeholder.com/40'}
                      alt="User"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                      <div className="px-4 py-2 text-gray-700 border-b">
                        {user.firstName} {user.lastName}
                      </div>
                      <a href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <UserIcon className="w-5 h-5 mr-2" /> Profile
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-5 h-5 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/auth"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign In
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

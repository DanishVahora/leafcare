import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf,
  Camera,
  Clock,
  Cpu,
  BookOpen,
  Settings,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showFullMenu?: boolean;
}

const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: Leaf },
  { name: 'Detection', path: '/detect', icon: Camera },
  { name: 'Docs', path: '/docs', icon: BookOpen },
  { name: 'History', path: '/history', icon: Clock },
  { name: 'Subscription', path: '/SubToPro', icon: Cpu },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Navbar: React.FC<NavbarProps> = ({ showFullMenu = true }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setHidden(currentScroll > lastScroll && currentScroll > 100);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return (
    <motion.nav
      className={cn(
        'fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100',
        'transition-transform duration-300 ease-out'
      )}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center space-x-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-green-600 to-emerald-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              LeafCare
            </span>
          </motion.a>

          {showFullMenu && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex space-x-4">
                  {NAV_LINKS.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.path}
                      className="relative px-3 py-2 text-gray-600 hover:text-green-700 group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-2">
                        <link.icon className="h-5 w-5" />
                        <span>{link.name}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 h-0.5 bg-green-600 w-0 group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  ))}
                </div>

                {/* User Section */}
                {user ? (
                  <div className="relative ml-4">
                    <motion.button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center space-x-2 group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                          src={user.photo || '/default-avatar.svg'}
                          alt="Profile"
                          className="h-9 w-9 rounded-full border-2 border-green-100 group-hover:border-transparent transition-all"
                        />
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-green-100"
                        >
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                            <div className="text-sm font-medium text-green-800">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-green-600">{user.email}</div>
                          </div>
                          <div className="p-2">
                            <a
                              href="/profile"
                              className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-green-50 rounded-lg"
                            >
                              <User className="h-5 w-5 text-green-600" />
                              <span>Profile Settings</span>
                            </a>
                            <button
                              onClick={logout}
                              className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-green-50 rounded-lg"
                            >
                              <LogOut className="h-5 w-5 text-green-600" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex gap-2 ml-4">
                    <motion.a
                      href="/auth"
                      className="px-5 py-2.5 rounded-lg bg-transparent text-green-600 hover:bg-green-50 transition-colors border border-green-100"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.a>
                    <motion.a
                      href="/signup"
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-green-600" />
                ) : (
                  <Menu className="h-6 w-6 text-green-600" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-green-100"
          >
            <div className="px-4 py-6 space-y-4">
              {user && (
                <div className="pb-4 border-b border-green-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.photo || '/default-avatar.svg'}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-green-600"
                    />
                    <div>
                      <div className="text-lg font-medium text-green-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-green-600">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <link.icon className="h-6 w-6 text-green-600" />
                  <span>{link.name}</span>
                </a>
              ))}

              {user ? (
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-red-500 hover:bg-green-50 rounded-lg"
                >
                  <LogOut className="h-6 w-6" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <a
                    href="/auth"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg border border-green-100"
                  >
                    <span>Login</span>
                  </a>
                  <a
                    href="/signup"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
                  >
                    <span>Sign Up</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
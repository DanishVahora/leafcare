import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext'; // Assuming you have a custom hook to get auth state
interface LayoutProps {
  children: React.ReactNode;
  showFullMenu?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFullMenu = true }) => {
  const {isLoading} = useAuth(); // Assuming you have a custom hook to get auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-green-100/50 to-white">
      <Navbar showFullMenu={showFullMenu} />
      <br /><br />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
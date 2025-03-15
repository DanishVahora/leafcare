import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingSubscribe = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        to="/SubToPro"
        className="w-full sm:w-auto bg-white hover:bg-green-200 text-black border-4 border-green-600 font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Cpu className="w-5 h-5" />
        <span className="font-semibold">Upgrade to Pro</span>
      </Link>
    </motion.div>
  );
};
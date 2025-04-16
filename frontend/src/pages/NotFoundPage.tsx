import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-9xl font-bold text-green-600 opacity-10">404</div>
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Leaf className="w-24 h-24 text-green-600" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mt-8 text-4xl font-bold text-gray-900">
            Oops! Looks like this leaf has fallen
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Don't worry, even lost leaves find their way back to nature. 
            Let's get you back to where you belong.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group flex items-center gap-2 text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </div>

          <motion.div
            className="mt-16 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-green-600 opacity-60"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
// motion/MotionDiv.tsx
import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionDivProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export const MotionDiv: React.FC<MotionDivProps> = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

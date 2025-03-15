import { 
  BrainCircuit, 
  Factory, 
  LeafyGreen, 
  Network, 
  TestTube2, 
  Wheat 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Layout from '../Layout/Layout';

// Advanced animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

// const fadeSlideIn = {
//   hidden: { opacity: 0, x: -30 },
//   visible: { opacity: 1, x: 0 },
//   transition: { duration: 0.6, ease: 'easeInOut' }
// };

// const hoverEffect = {
//   hover: {
//     y: -5,
//     scale: 1.02,
//     transition: { type: 'spring', stiffness: 300 }
//   }
// };

// const tapEffect = {
//   tap: { scale: 0.98 }
// };

const workflowSteps = [
  {
    step: 1,
    title: "Data Ingestion",
    description: "Collect plant images through IoT devices and user uploads. Validate metadata and store raw images in cloud storage.",
    icon: Network
  },
  {
    step: 2,
    title: "Image Processing",
    description: "Resize images to 128x128, normalize RGB values, and apply augmentation. Create processed batches for model input.",
    icon: TestTube2
  },
  {
    step: 3,
    title: "AI Prediction",
    description: "Run processed images through CNN model. Generate confidence scores and disease classification using Softmax output layer.",
    icon: BrainCircuit
  },
  {
    step: 4,
    title: "Result Caching",
    description: "Store predictions in Redis cache for quick retrieval. Maintain 7-day prediction history for each user session.",
    icon: Factory
  },
  {
    step: 5,
    title: "Database Storage",
    description: "Persist results in PostgreSQL with timestamps. Archive raw images in S3 with prediction metadata for retraining.",
    icon: LeafyGreen
  },
  {
    step: 6,
    title: "Feedback Loop",
    description: "Collect user corrections via UI. Schedule model retraining using accumulated data and feedback.",
    icon: Wheat
  }
];

export const DocumentPage = () => {
  return (
    <Layout>
      {/* Add Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 animate-[gradientShift_10s_infinite]" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Update the main container background */}
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 max-w-7xl">
          {/* Animated Header Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              whileHover={{ rotate: 3 }}
              className="p-3 bg-green-100 rounded-full shadow-sm inline-block mb-6"
            >
              <LeafyGreen className="w-10 h-10 text-green-700" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block"
              >
                LeafCare AI
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                Documentation
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 max-w-3xl mx-auto"
            >
              Next-generation plant pathology detection powered by deep learning
            </motion.p>
          </motion.div>

          {/* Animated Overview Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16 lg:mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-8">
              System Architecture
            </motion.h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Wheat,
                  title: 'Problem Statement',
                  content: '40% annual crop loss from plant diseases',
                  badge: 'Market Need'
                },
                {
                  icon: BrainCircuit,
                  title: 'Technical Approach',
                  content: ['Deep CNNs', 'Transfer Learning', 'Cloud Scaling'],
                  badges: ['CNN', 'TensorFlow']
                },
                {
                  icon: Factory,
                  title: 'Applications',
                  content: ['Precision Agriculture', 'Research Institutions'],
                  highlight: 'IoT Integration'
                }
              ].map((card, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{ hover: { y: -5 }, tap: { scale: 0.98 } }}
                  >
                    <Card className="group transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <card.icon className="w-7 h-7 text-green-600 transition-transform group-hover:rotate-12" />
                          <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Array.isArray(card.content) ? (
                          <ul className="list-disc pl-5 space-y-2">
                            {card.content.map((item, i) => (
                              <li key={i} className="text-gray-700">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700">{card.content}</p>
                        )}
                        {card.highlight && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 bg-green-50 p-3 rounded-lg"
                          >
                            <p className="text-green-700 text-sm">{card.highlight}</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Animated Architecture Diagram */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 lg:mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Neural Network Structure</h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: 'circOut' }}
              className="relative h-2 bg-gray-200 mb-6"
            >
              <div className="absolute inset-0 bg-green-500 origin-left" />
            </motion.div>

            <div className="overflow-x-auto pb-4">
              <motion.div
                className="min-w-max"
                initial={{ x: 100 }}
                whileInView={{ x: 0 }}
                transition={{ type: 'spring' }}
              >
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      {['Layer Type', 'Parameters', 'Activation'].map((header, i) => (
                        <TableHead key={i} className="px-6 py-4 font-semibold">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ['Input Layer', '128x128x3', '-'],
                      ['Conv2D x2', '32-512 filters', 'ReLU'],
                      ['Dense Layer', '1500 units', 'ReLU'],
                      ['Output Layer', '38 units', 'Softmax']
                    ].map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        {row.map((cell, j) => (
                          <TableCell key={j} className="px-6 py-4">
                            {cell}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            </div>
          </motion.section>

          {/* Interactive Performance Metrics */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-16 lg:mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance Metrics</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-6">Accuracy Metrics</h3>
                <div className="space-y-6">
                  <MetricBar label="Training Accuracy" value={98.7} delay={0.2} />
                  <MetricBar label="Validation Accuracy" value={94.2} delay={0.4} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-6">System Benchmarks</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Inference Time', value: '120ms' },
                    { label: 'Model Size', value: '65MB' },
                    { label: 'API Latency', value: '200ms' }
                  ].map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{metric.label}</span>
                      <Badge variant="outline" className="bg-green-50">
                        {metric.value}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Dynamic Workflow Visualization */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-16 lg:mb-20"
          >
            <div className="px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Workflow Process
              </h2>
            </div>

            <div className="relative">
              {/* Mobile scroll indicators */}
              <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-green-500/20 via-green-500/0 to-green-500/20 sm:hidden" />
              
              <motion.div
                className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-green-100"
                drag="x"
                dragConstraints={{ right: 0, left: -1000 }}
                whileTap={{ cursor: "grabbing" }}
              >
                <div className="flex space-x-4 sm:space-x-6 min-w-max px-4 sm:px-6">
                  {workflowSteps.map(({ step, title, description, icon: Icon }) => (
                    <motion.div
                      key={step}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-[280px] sm:w-[320px] flex-shrink-0"
                    >
                      <Card className="h-full p-4 sm:p-6 bg-white/90 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm sm:text-base">{step}</span>
                          </div>
                          <div className="h-px bg-gray-200 flex-1 mx-3 sm:mx-4" />
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{title}</h4>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Mobile scroll indicator */}
              <div className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-green-500/20 via-green-500/0 to-green-500/20 sm:hidden" />
            </div>

            {/* Mobile helper text */}
            <p className="text-xs text-center text-gray-500 mt-4 px-4 sm:hidden">
              Swipe left to see more steps
            </p>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

const MetricBar = ({ label, value, delay }: { label: string; value: number; delay?: number }) => (
  <motion.div
    initial={{ width: 0 }}
    whileInView={{ width: '100%' }}
    transition={{ delay, duration: 1.5, ease: 'easeInOut' }}
    className="space-y-2"
  >
    <div className="flex justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-medium text-green-700">{value}%</span>
    </div>
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-green-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: delay ? delay + 0.2 : 0.2, duration: 1.5, ease: 'easeInOut' }}
        style={{ originX: 0 }}
      />
    </div>
  </motion.div>
);
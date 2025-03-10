import React, { useEffect, useState } from "react";
import { BookOpen, Code, Layers, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DocumentPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: false,
    training: false,
    dataset: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Layout>
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          className="flex flex-col items-center text-center gap-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-semibold">Project Documentation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            Plant Disease Detection
            <span className="block text-green-600 mt-2">Technical Documentation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Comprehensive documentation covering model architecture, training process, dataset structure, and implementation details of our plant disease detection system.
          </p>
        </motion.div>
      </section>

      {/* MODEL ARCHITECTURE */}
      <section className="bg-gray-50 py-16 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-center mb-12 text-green-800">
            Model Architecture
          </motion.h2>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white mb-8">
            <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <Layers className="w-6 h-6" /> CNN Architecture Summary
            </h3>
            <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {`Model: "sequential"
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Layer (type)                         ┃ Output Shape                ┃         Param # ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ conv2d (Conv2D)                      │ (None, 128, 128, 32)        │             896 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ conv2d_1 (Conv2D)                    │ (None, 128, 128, 32)        │           9,248 │
│ ... (additional layers) ...          │                             │                 │
└──────────────────────────────────────┴─────────────────────────────┴─────────────────┘
Total params: 17,058,762 (65.07 MB)
Trainable params: 17,058,762 (65.07 MB)
Non-trainable params: 0 (0.00 B)`}
            </pre>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-lg rounded-xl bg-white">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" /> Layer Configuration
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {[
                  'Input Shape: 128x128x3 RGB images',
                  '5 Convolutional Blocks with increasing filters (32, 64, 128, 256, 512)',
                  'MaxPooling2D after each block',
                  'Dropout layers (0.25-0.4) for regularization',
                  'Flatten layer followed by Dense layers',
                  'Output Layer: 38 neurons with softmax activation'
                ].map((item, index) => (
                  <li key={index} className="p-2 hover:bg-green-50 rounded">{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 shadow-lg rounded-xl bg-white">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6" /> Key Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Total Layers', '20'],
                  ['Trainable Parameters', '17M'],
                  ['Activation Function', 'ReLU/Softmax'],
                  ['Pool Size', '2x2'],
                  ['Kernel Size', '3x3'],
                  ['Padding', 'same']
                ].map(([label, value]) => (
                  <div key={label} className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="text-lg font-bold text-green-600">{value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* TRAINING PROCESS */}
      <section className="py-16 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-center mb-12 text-green-800">
            Training Process
          </motion.h2>

          <div className="space-y-8">
            <Card className="p-6 shadow-lg rounded-xl bg-white">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('training')}>
                <h3 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
                  <Code className="w-6 h-6" /> Training Configuration
                </h3>
                <motion.div animate={{ rotate: expandedSections.training ? 180 : 0 }}>
                  {expandedSections.training ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </motion.div>
              </div>
              <AnimatePresence>
                {expandedSections.training && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg">
                        {`model.compile(
  optimizer=Adam(learning_rate=0.0001),
  loss='categorical_crossentropy',
  metrics=['accuracy']
)

training_history = model.fit(
  x=training_set,
  validation_data=validation_set,
  epochs=10
)`}
                      </pre>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          ['Batch Size', '32'],
                          ['Epochs', '10'],
                          ['Learning Rate', '0.0001'],
                          ['Validation Split', '20%'],
                          ['Optimizer', 'Adam'],
                          ['Loss Function', 'Categorical Crossentropy']
                        ].map(([label, value]) => (
                          <div key={label} className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600">{label}</div>
                            <div className="text-lg font-bold text-green-600">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card className="p-6 shadow-lg rounded-xl bg-white">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6" /> Dataset Preparation
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Training Set</h4>
                  <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg">
                    {`tf.keras.utils.image_dataset_from_directory(
  'train',
  image_size=(128, 128),
  batch_size=32,
  shuffle=True
)`}
                  </pre>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Validation Set</h4>
                  <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg">
                    {`tf.keras.utils.image_dataset_from_directory(
  'valid',
  image_size=(128, 128),
  batch_size=32,
  shuffle=True
)`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* PERFORMANCE METRICS */}
      <section className="bg-gray-50 py-16 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-center mb-12 text-green-800">
            Performance Metrics
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['98%', 'Training Accuracy'],
              ['95%', 'Validation Accuracy'],
              ['17M', 'Parameters'],
              ['10', 'Epochs'],
              ['32', 'Batch Size'],
              ['0.0001', 'Learning Rate']
            ].map(([value, label], index) => (
              <motion.div key={label} variants={fadeInUp} custom={index}>
                <Card className="p-6 text-center shadow-lg rounded-xl bg-white hover:shadow-xl transition-shadow">
                  <div className="text-4xl font-bold text-green-600 mb-2">{value}</div>
                  <div className="text-lg text-gray-600">{label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default DocumentPage;
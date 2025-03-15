import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import landingImg from '../assets/landing-img.jpeg'; // <--- Import the image


const HomePage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isTrainingExpanded, setIsTrainingExpanded] = useState(false);

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

  const slideUp = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 }
  };

  return (
    <Layout>
      {/* Scroll Progress Bar - remains unchanged */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* HERO SECTION - Updated for mobile */}
      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          {/* Left Content - Mobile optimized */}
          <div className="flex-1 space-y-4 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
              <Badge variant="secondary" className="text-xs md:text-sm">AI-Powered Solution</Badge>
              <Badge variant="outline" className="text-xs">New</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900">
              Plant Disease Detection
              <span className="block text-xl sm:text-2xl md:text-4xl text-green-600 mt-2">
                Powered by Deep Learning
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Our state-of-the-art AI model, trained on thousands of plant images, delivers rapid and precise disease detection.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
              <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto bg-transparent hover:bg-green-50 text-green-800 font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base border border-green-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image - Mobile optimized */}
          <div className="flex-1 w-full md:w-auto mt-8 md:mt-0">
            <div className="relative max-w-sm md:max-w-lg mx-auto">
              <motion.img
                src={landingImg}
                alt="Plant Disease Detection"
                className="rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/80 backdrop-blur-md rounded-lg md:rounded-2xl p-3 md:p-6 shadow-md md:shadow-xl">
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {[['98%', 'Accuracy'], ['50k+', 'Images'], ['24/7', 'Support']].map(([value, label]) => (
                      <div key={label} className="text-center">
                        <div className="text-base md:text-2xl font-bold text-green-600">{value}</div>
                        <div className="text-xs md:text-sm text-gray-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ABOUT SECTION - Mobile optimized */}
      <section className="bg-gray-50 py-8 md:py-16 px-4 sm:px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <div className="text-center">
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4 text-green-800">
              About the Project
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-700 mb-8">
              We developed a sophisticated convolutional neural network (CNN) to detect plant diseases in real-time.
              The model is built using TensorFlow and trained on a comprehensive dataset of plant images, ensuring high precision and reliability.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <div
                className="flex items-center justify-center gap-2 cursor-pointer text-green-700 hover:text-green-800 transition-colors"
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              >
                <span>{isAboutExpanded ? 'See Less' : 'See More'}</span>
                <motion.div
                  animate={{ rotate: isAboutExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isAboutExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </motion.div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isAboutExpanded && (
              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8 space-y-6 overflow-hidden"
              >
                <Card className="p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-2xl font-semibold text-green-700 mb-4">Technical Details</h3>
                  <p className="text-gray-700">
                    Our CNN architecture leverages transfer learning with a pre-trained EfficientNet backbone,
                    fine-tuned with custom layers for plant disease specificity. The model achieves state-of-the-art
                    results through advanced regularization techniques and optimized hyperparameters.
                  </p>
                </Card>
                <Card className="p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-2xl font-semibold text-green-700 mb-4">Dataset Composition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[['Plant Species', '38'], ['Disease Classes', '150+'], ['Total Images', '54,305'], ['Validation Split', '20%']].map(([label, value]) => (
                      <div key={label} className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{value}</div>
                        <div className="text-sm text-gray-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* MODEL ARCHITECTURE - Mobile optimized */}
      <section className="py-8 md:py-16 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-green-800">
            Model Architecture
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 shadow-xl rounded-xl bg-white hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">Data Preparation</h3>
                <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {`training_set = tf.keras.utils.image_dataset_from_directory(
  'train',
  labels="inferred",
  image_size=(128, 128),
  batch_size=32,
  shuffle=True
)`}
                </pre>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="p-6 shadow-xl rounded-xl bg-white hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">CNN Model Layers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {[
                    'Input: 128x128x3',
                    'Convolutional layers: Filters 32, 64, 128, 256, 512',
                    'MaxPooling after each block',
                    'Dropout layers (0.5 rate)',
                    'Dense layer with 1500 neurons',
                    'Output layer with 38 neurons (softmax)'
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* TRAINING PROCESS - Mobile optimized */}
      <section className="bg-gray-50 py-8 md:py-16 px-4 sm:px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <div className="text-center">
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-green-800">
              Training Process
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
              Our model was trained using TensorFlow's image_dataset_from_directory with a batch size of 32 and image size of 128×128.
              Adam optimizer with learning rate of 0.0001, trained for 10 epochs using categorical crossentropy.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <div
                className="flex items-center justify-center gap-2 cursor-pointer text-green-700 hover:text-green-800 transition-colors"
                onClick={() => setIsTrainingExpanded(!isTrainingExpanded)}
              >
                <span className="text-sm md:text-base">{isTrainingExpanded ? 'See Less' : 'See More'}</span>
                <motion.div
                  animate={{ rotate: isTrainingExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isTrainingExpanded ? <ChevronUp className="w-4 md:w-5 h-4 md:h-5" /> : <ChevronDown className="w-4 md:w-5 h-4 md:h-5" />}
                </motion.div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isTrainingExpanded && (
              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 md:mt-8 space-y-4 md:space-y-6 overflow-hidden"
              >
                <Card className="p-4 md:p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-xl md:text-2xl font-semibold text-green-700 mb-3 md:mb-4">Training Parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {[
                      ['Batch Size', '32'],
                      ['Epochs', '10'],
                      ['Learning Rate', '0.0001'],
                      ['Optimizer', 'Adam'],
                      ['Loss Function', 'Categorical Crossentropy'],
                      ['Augmentation', 'Yes']
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 md:p-4 bg-green-50 rounded-lg text-center">
                        <div className="text-xs md:text-sm text-gray-600">{label}</div>
                        <div className="text-base md:text-lg font-bold text-green-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4 md:p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-xl md:text-2xl font-semibold text-green-700 mb-3 md:mb-4">Training Code</h3>
                  <pre className="text-xs md:text-sm text-gray-700 bg-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                    {`model.compile(
  optimizer=Adam(learning_rate=0.0001),
  loss='categorical_crossentropy',
  metrics=['accuracy']
)

history = model.fit(
  training_set,
  validation_data=validation_set,
  epochs=10,
  callbacks=[EarlyStopping(patience=3)]
)`}
                  </pre>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* TRAINING RESULTS - Mobile optimized */}
      <section className="py-8 md:py-16 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-green-800">
            Training Results
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            {[['17M+', 'Parameters'], ['10', 'Epochs'], ['98%', 'Accuracy']].map(([value, label], index) => (
              <motion.div key={label} variants={fadeInUp} custom={index}>
                <Card className="p-4 md:p-8 shadow-lg md:shadow-xl rounded-xl md:rounded-2xl bg-white hover:shadow-2xl transition-shadow text-center">
                  <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">{value}</div>
                  <div className="text-sm md:text-lg text-gray-600">{label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;
import React, { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Camera,
  Upload,
  Check,
  Info,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import landingImg from '../assets/landing-img.jpeg';
// import { useScroll } from "@studio-freight/react-lenis";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isUseExpanded, setIsUseExpanded] = useState(false);
  const detectionRef = useRef<HTMLDivElement>(null);

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

  const detectionSteps = [
    {
      icon: <Camera className="w-10 h-10 text-green-600" />,
      title: "Capture Image",
      description: "Take a clear photo of the plant leaf or affected area in good lighting for accurate detection."
    },
    {
      icon: <Upload className="w-10 h-10 text-green-600" />,
      title: "Upload to System",
      description: "Upload the image to our platform where our advanced AI model will process it."
    },
    {
      icon: <Info className="w-10 h-10 text-green-600" />,
      title: "AI Analysis",
      description: "Our deep learning model analyzes the image, identifying patterns associated with various plant diseases."
    },
    {
      icon: <Check className="w-10 h-10 text-green-600" />,
      title: "Get Results",
      description: "Receive detailed results about the detected disease, including treatment recommendations."
    }
  ];

  

  const useCases = [
    {
      title: "Small-Scale Farmers",
      description: "Empower local farmers with limited access to agricultural experts to quickly identify crop diseases and prevent harvest losses.",
      icon: <Leaf className="w-12 h-12 text-green-600" />
    },
    {
      title: "Research Institutions",
      description: "Accelerate plant pathology research by quickly processing thousands of samples and identifying disease patterns.",
      icon: <Info className="w-12 h-12 text-green-600" />
    },
    {
      title: "Home Gardeners",
      description: "Help hobby gardeners maintain healthy plants by providing expert-level disease diagnosis and treatment recommendations.",
      icon: <Home className="w-12 h-12 text-green-600" />
    }
  ];

  

  return (
    <Layout>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          {/* Left Content */}
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
              <Button
                onClick={() => navigate('/detect')}
                className="w-full cursor-pointer sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/docs')}
                className="w-full sm:w-auto bg-transparent hover:bg-green-50 text-green-800 font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base border cursor-pointer border-green-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Image */}
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

      {/* ABOUT SECTION */}
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

                <Card className="p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-2xl font-semibold text-green-700 mb-4">Problem Statement</h3>
                  <p className="text-gray-700 mb-4">
                    Plant diseases cause billions in economic losses annually and threaten global food security. Traditional disease diagnosis methods are:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Time-consuming and require expert knowledge</li>
                    <li>Often delayed until disease has spread significantly</li>
                    <li>Inaccessible to small-scale farmers in developing regions</li>
                    <li>Susceptible to human error and inconsistency</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    Our AI-based solution addresses these challenges by providing instant, accurate disease detection accessible through any smartphone camera.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* USE CASES - NEW SECTION */}
      <section className="py-8 md:py-16 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-green-800">
            Use Cases & Applications
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Our plant disease detection technology has diverse applications across various agricultural sectors,
            helping to address critical challenges in global food security and crop management.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                variants={fadeInUp}
                custom={index}
              >
                <Card className="p-6 md:p-8 shadow-lg rounded-xl bg-white hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{useCase.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp}>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer text-green-700 hover:text-green-800 transition-colors"
              onClick={() => setIsUseExpanded(!isUseExpanded)}
            >
              <span>{isUseExpanded ? 'Show Less' : 'Show More Applications'}</span>
              <motion.div
                animate={{ rotate: isUseExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isUseExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isUseExpanded && (
              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8 space-y-6 overflow-hidden"
              >
                <Card className="p-6 shadow-lg rounded-xl bg-white">
                  <Tabs defaultValue="agriculture" className="w-full">
                    <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
                      <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="research">Research</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agriculture" className="space-y-4">
                      <h4 className="text-xl font-semibold text-green-700">Agricultural Applications</h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Early disease detection and prevention in commercial farming</li>
                        <li>Automated crop monitoring systems integrated with farm management software</li>
                        <li>Smart greenhouse disease surveillance</li>
                        <li>Mobile field diagnostics for extension workers in rural areas</li>
                        <li>Crop insurance damage assessment and verification</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="education" className="space-y-4">
                      <h4 className="text-xl font-semibold text-green-700">Educational Applications</h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Training tool for agricultural students and new farmers</li>
                        <li>Interactive learning platform for plant pathology</li>
                        <li>Community knowledge sharing for urban gardening initiatives</li>
                        <li>Farmer training programs in developing regions</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="research" className="space-y-4">
                      <h4 className="text-xl font-semibold text-green-700">Research Applications</h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Accelerated disease-resistant crop development</li>
                        <li>Climate change impact studies on plant disease patterns</li>
                        <li>Biodiversity conservation by monitoring wild plant populations</li>
                        <li>Epidemiological studies for disease spread prediction</li>
                        <li>Building comprehensive disease databases from field samples</li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* DISEASE DETECTION STEPS - NEW SECTION */}
      {/* DISEASE DETECTION STEPS - NEW SECTION */}
      <section ref={detectionRef} className="bg-gray-50 py-8 md:py-16 px-4 sm:px-6 overflow-hidden">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-green-800">
            How to Detect Plant Diseases
          </motion.h2>

          {/* Interactive Timeline */}
          <div className="relative py-12">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute left-0 right-0 h-1 bg-green-200 top-1/2 transform -translate-y-1/2 z-0" />

            {/* Vertical line for mobile */}
            <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 bg-green-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {detectionSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  custom={index}
                  className="relative"
                >
                  {/* Mobile Timeline Node */}
                  <div className="md:hidden absolute left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full z-10" />

                  {/* Desktop Timeline Node */}
                  <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-12 w-6 h-6 bg-green-600 rounded-full z-10" />

                  {/* Step Number - Desktop */}
                  <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-12 w-6 h-6 bg-green-600 rounded-full items-center justify-center text-white text-xs font-bold z-20">
                    {index + 1}
                  </div>

                  {/* Content Card with Hover Animation */}
                  <motion.div
                    className="ml-12 md:ml-0 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                  >
                    <div className="p-6">
                      {/* Step Number - Mobile */}
                      <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold mb-4">
                        {index + 1}
                      </div>

                      {/* Icon with pulse animation */}
                      <motion.div
                        className="mx-auto mb-4 bg-green-50 w-16 h-16 rounded-full flex items-center justify-center"
                        animate={{
                          boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)'],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          repeatDelay: index * 0.5
                        }}
                      >
                        {step.icon}
                      </motion.div>

                      <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">{step.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base text-center">{step.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive Demo Card */}
          
        </motion.div>
      </section>

      {/* TRAINING RESULTS */}
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
            {[['17M+', 'Parameters'], ['4', 'Epochs'], ['98%', 'Accuracy']].map(([value, label], index) => (
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







      {/* CALL TO ACTION */}
      <section className="py-8 md:py-16 px-4 sm:px-6 bg-white">
      <motion.div
            variants={fadeInUp}
            className="mt-12"
          >
            <Card className="p-6 md:p-8 max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-green-100 border-none shadow-lg rounded-xl">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  >
                    <Camera className="w-12 h-12 text-green-600" />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Ready to Try It Yourself?</h3>
                  <p className="text-green-700 mb-4">
                    Upload a plant image and watch our AI identify diseases in seconds.
                    Get tailored treatment recommendations instantly.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      onClick={() => navigate('/detect')}
                    >
                      Try Demo Now
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-700 hover:bg-green-100"
                      onClick={() => navigate('/SubToPro')}
                    >
                      View Plans
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;

// Add Home icon that was missing in the imports
const Home = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
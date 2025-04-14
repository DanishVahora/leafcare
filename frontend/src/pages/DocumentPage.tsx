import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../Layout/Layout";
import { Card } from "@/components/ui/card";
import Chart from "chart.js/auto";
import { 
  Cpu,
  Database,
  BookOpen,
  LineChart,
  FileText,
  ArrowRightLeft,
  BrainCircuit,
  Lightbulb,
  TestTube2,
  Activity,
  Workflow,
  Layers,
  Check,
  GitFork,
  FileCode,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const DocumentPage = () => {
  const accuracyChartRef = useRef(null);
  const lossChartRef = useRef(null);
  const [activeTab, setActiveTab] = useState("architecture");

  useEffect(() => {
    // Accuracy Chart
    if (accuracyChartRef.current) {
      const accuracyChart = new Chart(accuracyChartRef.current, {
        type: 'line',
        data: {
          labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'],
          datasets: [
            {
              label: 'Training Accuracy',
              data: [94.12, 99.05, 99.34, 99.58],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Test Accuracy',
              data: [93.48, 98.67, 98.89, 99.09],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Model Accuracy by Epoch',
              font: {
                size: 16
              }
            }
          },
          scales: {
            y: {
              min: 90,
              max: 100,
              title: {
                display: true,
                text: 'Accuracy (%)'
              }
            }
          }
        }
      });

      return () => {
        accuracyChart.destroy();
      };
    }
  }, [accuracyChartRef.current]);

  useEffect(() => {
    // Loss Chart
    if (lossChartRef.current) {
      const lossChart = new Chart(lossChartRef.current, {
        type: 'line',
        data: {
          labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'],
          datasets: [
            {
              label: 'Training Loss',
              data: [0.5513, 0.0554, 0.0296, 0.0176],
              borderColor: 'rgb(244, 63, 94)',
              backgroundColor: 'rgba(244, 63, 94, 0.2)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Model Loss by Epoch',
              font: {
                size: 16
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Loss'
              }
            }
          }
        }
      });

      return () => {
        lossChart.destroy();
      };
    }
  }, [lossChartRef.current]);

  const renderSection = (title, icon, content) => (
    <motion.div 
      variants={fadeInUp}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-green-100 text-green-700">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
      </div>
      {content}
    </motion.div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerAnimation}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4 flex items-center justify-center gap-3">
              <TestTube2 className="w-10 h-10" />
              Plant Disease Detection
              <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                Documentation
              </Badge>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A comprehensive documentation of our AI-powered plant disease detection system, 
              showcasing the architecture, methodology, and workflow.
            </p>
          </motion.div>

          <Tabs defaultValue="architecture" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-green-50 p-1 rounded-lg">
              <TabsTrigger value="architecture" className="data-[state=active]:bg-green-600">
                <Cpu className="w-4 h-4 mr-2" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-green-600">
                <LineChart className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="workflow" className="data-[state=active]:bg-green-600">
                <Workflow className="w-4 h-4 mr-2" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-green-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="architecture" className="mt-6">
              {renderSection(
                "System Architecture",
                <Layers className="w-6 h-6" />,
                <Card className="p-6 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-700">Architecture Overview</h3>
                      <p className="text-gray-700 mb-4">
                        Our plant disease detection system utilizes a Vision Transformer (ViT) 
                        architecture fine-tuned on the PlantVillage dataset. The system consists of:
                      </p>
                      <ul className="space-y-2 pl-6 list-disc text-gray-700">
                        <li>Frontend React application for user interaction</li>
                        <li>Backend FastAPI server for image processing and inference</li>
                        <li>ViT model with 12 transformer layers and 768 embedding dimensions</li>
                        <li>Treatment recommendation engine powered by Gemini API</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-center text-gray-800 mb-3">Model Architecture</h4>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-auto max-h-64">
                        <pre className="text-xs">
{`ViTForImageClassification(
  (vit): ViTModel(
    (embeddings): ViTEmbeddings(
      (patch_embeddings): ViTPatchEmbeddings(
        (projection): Conv2d(3, 768, kernel_size=(16, 16))
      )
    )
    (encoder): ViTEncoder(
      (layer): ModuleList(12 x ViTLayer)
    )
    (layernorm): LayerNorm((768))
  )
  (classifier): Linear(in=768, out=38)
)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">Data Pipeline</h3>
                    <div className="relative">
                      <div className="absolute left-4 inset-y-0 w-0.5 bg-green-200"></div>
                      <div className="space-y-6 relative">
                        {[
                          {
                            title: "Image Acquisition",
                            description: "User uploads image via web interface or mobile camera",
                            icon: <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">1</div>
                          },
                          {
                            title: "Preprocessing",
                            description: "Images are resized to 224x224 and normalized to match ViT input requirements",
                            icon: <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">2</div>
                          },
                          {
                            title: "Feature Extraction",
                            description: "ViT splits image into 16x16 patches and processes through transformer layers",
                            icon: <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">3</div>
                          },
                          {
                            title: "Classification",
                            description: "Output layer predicts one of 38 plant disease classes with confidence score",
                            icon: <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">4</div>
                          },
                          {
                            title: "Treatment Generation",
                            description: "Disease prediction triggers Gemini API to generate targeted treatment recommendations",
                            icon: <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">5</div>
                          }
                        ].map((step, index) => (
                          <div key={index} className="flex items-start ml-4 pl-6">
                            {step.icon}
                            <div className="ml-4">
                              <h4 className="font-semibold text-green-800">{step.title}</h4>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              {renderSection(
                "Training Methodology",
                <BrainCircuit className="w-6 h-6" />,
                <Card className="p-6 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-700">Dataset</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Database className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">PlantVillage Dataset</p>
                            <p className="text-gray-600 text-sm">
                              54,306 high-quality RGB images of healthy and diseased plant leaves across 38 classes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <GitFork className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">Data Split</p>
                            <p className="text-gray-600 text-sm">
                              Train: 43,444 images (80%) | Test: 10,862 images (20%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <ArrowRightLeft className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">Augmentation</p>
                            <p className="text-gray-600 text-sm">
                              Resize (224x224), normalization with mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]
                            </p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-4 mt-8 text-green-700">Training Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FileCode className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">Model Base</p>
                            <p className="text-gray-600 text-sm">
                              google/vit-base-patch16-224-in21k (pre-trained on ImageNet)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Activity className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">Hyperparameters</p>
                            <p className="text-gray-600 text-sm">
                              Optimizer: AdamW, Learning Rate: 5e-5, Batch Size: 32, Epochs: 4
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium">Final Results</p>
                            <p className="text-gray-600 text-sm">
                              Training Accuracy: 99.58% | Test Accuracy: 99.09%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-700">Training Progress</h3>
                        <div className="bg-white rounded-lg p-3 shadow-sm mb-6">
                          <canvas ref={accuracyChartRef}></canvas>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <canvas ref={lossChartRef}></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="workflow" className="mt-6">
              {renderSection(
                "Workflow Steps",
                <Workflow className="w-6 h-6" />,
                <Card className="p-6 shadow-lg">
                  <div className="relative">
                    <div className="absolute left-6 inset-y-0 w-1 bg-green-100 rounded-full"></div>
                    <div className="space-y-12">
                      {[
                        {
                          title: "Image Upload",
                          description: "Users can upload plant leaf images through the web interface via drag-and-drop or URL input",
                          details: [
                            "Support for JPEG and PNG formats",
                            "Optional cross-origin handling for remote images",
                            "Built-in validation for image types"
                          ]
                        },
                        {
                          title: "Preprocessing",
                          description: "The uploaded image undergoes preprocessing before being sent to the model",
                          details: [
                            "Resizing to 128x128 pixels for UI display",
                            "Converting to RGB color space if needed",
                            "Normalizing pixel values to float32 (0-1 range)"
                          ]
                        },
                        {
                          title: "Model Inference",
                          description: "The preprocessed image is sent to the backend FastAPI server for inference",
                          details: [
                            "Image packaged into FormData for transmission",
                            "API endpoint processes the image using the ViT model",
                            "Model classifies the image into one of 38 disease categories"
                          ]
                        },
                        {
                          title: "Result Analysis",
                          description: "The system displays prediction results with confidence scores",
                          details: [
                            "Top prediction highlighted with confidence percentage",
                            "Alternative predictions shown for comparison",
                            "Visual indication of confidence level"
                          ]
                        },
                        {
                          title: "Treatment Generation",
                          description: "For identified diseases, the system generates comprehensive treatment information",
                          details: [
                            "Disease information and spreading mechanism",
                            "Organic and chemical treatment options",
                            "Prevention tips and recommended products",
                            "Educational resources for further learning"
                          ]
                        },
                        {
                          title: "Result Sharing",
                          description: "For Pro users, results can be saved and shared through various channels",
                          details: [
                            "PDF report generation with detailed findings",
                            "Email sharing functionality",
                            "WhatsApp integration for mobile sharing",
                            "Clipboard copy for quick references"
                          ]
                        }
                      ].map((step, index) => (
                        <div key={index} className="relative pl-12">
                          <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-green-800 mb-2">{step.title}</h3>
                            <p className="text-gray-700 mb-4">{step.description}</p>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <ul className="space-y-2">
                                {step.details.map((detail, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span className="text-gray-600">{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              {renderSection(
                "Project Features & Use Cases",
                <Lightbulb className="w-6 h-6" />,
                <Card className="p-6 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Key Features
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          {
                            title: "High Accuracy Disease Detection",
                            description: "99.09% accuracy on test set covering 38 disease classes across multiple crops"
                          },
                          {
                            title: "Multi-platform Accessibility",
                            description: "Web-based interface adaptable to desktop and mobile devices"
                          },
                          {
                            title: "Real-time Processing",
                            description: "Quick analysis with minimal latency using optimized inference"
                          },
                          {
                            title: "Comprehensive Treatment Guides",
                            description: "Detailed treatment recommendations with organic and chemical options"
                          },
                          {
                            title: "Multilingual Support",
                            description: "Text-to-speech functionality with support for local languages"
                          },
                          {
                            title: "Offline Capability",
                            description: "Progressive web app functionality for limited connectivity areas"
                          },
                          {
                            title: "Custom Reporting",
                            description: "Exportable reports in PDF format with visual and textual information"
                          }
                        ].map((feature, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
                            <h4 className="font-medium text-green-800">{feature.title}</h4>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Use Cases
                      </h3>
                      
                      <div className="space-y-6">
                        {[
                          {
                            title: "Small-scale Farmers",
                            description: "Early disease detection without expert consultation, reducing crop loss and improving yield",
                            icon: "🌾"
                          },
                          {
                            title: "Agricultural Extension Workers",
                            description: "Quick field diagnosis tool to serve multiple farmers efficiently in rural areas",
                            icon: "👨‍🌾"
                          },
                          {
                            title: "Agricultural Research",
                            description: "Data collection and analysis for understanding disease patterns and developing better control measures",
                            icon: "🔬"
                          },
                          {
                            title: "Educational Institutions",
                            description: "Teaching tool for agricultural students to learn about plant pathology and disease identification",
                            icon: "🎓"
                          },
                          {
                            title: "Home Gardeners",
                            description: "Hobby gardeners can identify and treat common plant diseases in home gardens",
                            icon: "🪴"
                          }
                        ].map((useCase, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                              {useCase.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-green-800">{useCase.title}</h4>
                              <p className="text-gray-600">{useCase.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Impact Assessment
                        </h4>
                        <p className="text-amber-700 text-sm">
                          Our system has the potential to reduce crop losses by up to 25% through early detection and timely intervention, 
                          directly impacting food security and farmer livelihoods in developing regions.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <motion.div variants={fadeInUp} className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <TestTube2 className="w-5 h-5" />
              Technical Specifications
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-green-700 mb-2">Frontend</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React with TypeScript</li>
                  <li>• Framer Motion for animations</li>
                  <li>• Chart.js for data visualization</li>
                  <li>• Tailwind CSS for styling</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-green-700 mb-2">Backend</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• FastAPI for REST endpoints</li>
                  <li>• PyTorch for model inference</li>
                  <li>• Gemini API integration</li>
                  <li>• Docker containerization</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-green-700 mb-2">Model</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Vision Transformer (ViT) architecture</li>
                  <li>• 86M parameters</li>
                  <li>• 38 disease classes</li>
                  <li>• SafeTensors format (304MB)</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <p className="text-gray-600">
              © 2025 Plant Disease Detection Project | Documentation Version 1.0
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DocumentPage;
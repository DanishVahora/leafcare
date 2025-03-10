import { BookOpen, BrainCircuit, Factory, LeafyGreen, Network, TestTube2, Wheat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Layout from '../Layout/Layout';
import { MotionDiv } from '../motion/MotionDiv';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const DocumentPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-100 to-white transition-colors duration-700">
        <div className="container mx-auto px-6 py-20">
          {/* Page Header */}
          <MotionDiv {...fadeIn} className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6 transition-transform duration-500 hover:scale-110">
              <div className="p-4 rounded-full bg-green-100 shadow-lg">
                <LeafyGreen className="w-10 h-10 text-green-700" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                PlantPath AI - Technical Documentation
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto transition-colors duration-500">
              Enterprise-grade plant disease detection system powered by advanced deep learning and computer vision.
            </p>
          </MotionDiv>

          {/* Overview Section */}
          <section className="mb-20">
            <MotionDiv {...fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Overview</h2>
              <hr className="border-gray-300 mb-8" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Wheat className="w-7 h-7 text-green-600" />
                      Problem Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Agricultural productivity faces significant threats from plant diseases, causing up to 40% crop loss annually.
                      Manual detection is slow and requires expert knowledge, necessitating a scalable, automated solution.
                    </p>
                    <Badge variant="outline" className="mt-4 bg-green-100">Market Need</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <BrainCircuit className="w-7 h-7 text-green-600" />
                      Technical Approach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li>• Deep Convolutional Neural Networks (CNN)</li>
                      <li>• Transfer Learning Optimization</li>
                      <li>• Image Processing Pipeline</li>
                      <li>• Cloud-based Scalability</li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="outline" className="bg-green-100">CNN</Badge>
                      <Badge variant="outline" className="bg-green-100">TensorFlow</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Factory className="w-7 h-7 text-green-600" />
                      Industry Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Sectors:</h4>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Precision Agriculture</li>
                        <li>Agri-tech Platforms</li>
                        <li>Research Institutions</li>
                      </ul>
                    </div>
                    <div className="mt-4 bg-green-50 p-3 rounded-lg transition-colors duration-300 hover:bg-green-100">
                      <p className="text-sm text-green-700">
                        Seamless integration with IoT devices and farm management systems.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </MotionDiv>
            <MotionDiv {...fadeIn}>
              <p className="text-gray-600 mb-4">
                The PlantPath AI platform is the culmination of extensive research in computer vision and agricultural sciences.
                Leveraging modern deep learning techniques, it diagnoses and predicts plant diseases to enable proactive measures that minimize economic losses.
              </p>
              <p className="text-gray-600">
                Automating the detection process not only saves valuable time but also guarantees consistent results across various conditions.
                Continuous model updates and feedback loops drive its evolution in addressing emerging disease patterns.
              </p>
            </MotionDiv>
          </section>

          {/* Architecture & Data Pipeline Section */}
          <section className="mb-20">
            <MotionDiv {...fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">System Architecture</h2>
              <hr className="border-gray-300 mb-8" />
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-4 transition-all duration-300">Model Structure</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Layer Type</TableHead>
                        <TableHead>Parameters</TableHead>
                        <TableHead>Activation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Input Layer</TableCell>
                        <TableCell>128x128x3</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Conv2D x2</TableCell>
                        <TableCell>32-512 filters</TableCell>
                        <TableCell>ReLU</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dense Layer</TableCell>
                        <TableCell>1500 units</TableCell>
                        <TableCell>ReLU</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Output Layer</TableCell>
                        <TableCell>38 units</TableCell>
                        <TableCell>Softmax</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <h4 className="font-semibold mb-4 transition-all duration-300">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Training Accuracy</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '98.7%' }} />
                        </div>
                        <span className="text-green-600 font-medium">98.7%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Validation Accuracy</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '94.2%' }} />
                        </div>
                        <span className="text-green-600 font-medium">94.2%</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Badge className="bg-green-100 text-green-700 transition-all duration-300">Inference Time: 120ms</Badge>
                      <Badge className="bg-green-100 text-green-700 transition-all duration-300">Model Size: 65MB</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv {...fadeIn}>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Data Pipeline</h2>
              <hr className="border-gray-300 mb-8" />
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-4 transition-all duration-300">Dataset Structure</h4>
                  <ul className="space-y-3 text-gray-600">
                    <li>• 38 Plant Species</li>
                    <li>• 87 Disease Classes</li>
                    <li>• 150,000+ Images</li>
                    <li>• 70-30 Train-Validation Split</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 transition-all duration-300">Preprocessing</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="transition-all duration-300">
                        Resize: 128x128
                      </Badge>
                      <Badge variant="outline" className="transition-all duration-300">
                        Normalization
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="transition-all duration-300">
                        Augmentation
                      </Badge>
                      <Badge variant="outline" className="transition-all duration-300">
                        Batch: 32
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </section>

          {/* Training Methodology Section */}
          <section className="mb-20">
            <MotionDiv {...fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Training Methodology</h2>
              <hr className="border-gray-300 mb-8" />
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8">
                  <h3 className="text-2xl font-bold mb-6">Optimization Strategy</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 transition-all duration-300">Key Techniques</h4>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Adam Optimizer (lr=0.0001)</li>
                        <li>Categorical Cross-Entropy Loss</li>
                        <li>Early Stopping</li>
                        <li>L2 Regularization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 transition-all duration-300">Hardware Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-green-100 transition-all duration-300">
                          NVIDIA A100 GPUs
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 transition-all duration-300">
                          Distributed Training
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8">
                  <h3 className="text-2xl font-bold mb-6">Validation Results</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Training</TableHead>
                        <TableHead>Validation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>98.7%</TableCell>
                        <TableCell>94.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Precision</TableCell>
                        <TableCell>97.8%</TableCell>
                        <TableCell>93.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Recall</TableCell>
                        <TableCell>98.2%</TableCell>
                        <TableCell>92.7%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </MotionDiv>
          </section>

          {/* Project Features, Use Cases & Workflow Section */}
          <section className="mb-20">
            <MotionDiv {...fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Features & Use Cases</h2>
              <hr className="border-gray-300 mb-8" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <BrainCircuit className="w-7 h-7 text-green-600" />
                      Automated Model Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Seamlessly integrate new training data to continuously enhance detection accuracy.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Factory className="w-7 h-7 text-green-600" />
                      Scalable Deployment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Deploy across cloud infrastructures and IoT devices for real-time monitoring.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TestTube2 className="w-7 h-7 text-green-600" />
                      Real-Time Feedback Loop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Integrate with farm management systems to deliver instant insights and proactive alerts.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Wheat className="w-7 h-7 text-green-600" />
                      Precision Farming
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Empower farmers with timely disease detection, predictive analytics, and custom treatment plans.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <LeafyGreen className="w-7 h-7 text-green-600" />
                      Crop Insurance & Risk Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Leverage insights for efficient claims processing, risk assessment, and tailored insurance products.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Network className="w-7 h-7 text-green-600" />
                      Research & Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Support academic and industrial research with a robust dataset and state-of-the-art architecture.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </MotionDiv>

            <MotionDiv {...fadeIn} className="mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Workflow Steps</h3>
              <hr className="border-gray-300 mb-8" />
              <p className="text-gray-600 mb-4">
                Follow these streamlined steps to transform raw data into actionable insights:
              </p>
              <div className="flex space-x-6 overflow-x-auto py-4">
                {/* Step 1 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 1</Badge>
                        Data Collection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Gather extensive image datasets from farms, satellites, and IoT sensors.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 2 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 2</Badge>
                        Preprocessing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Clean, resize, and augment images to ensure optimal model ingestion.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 3 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 3</Badge>
                        Model Training
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Train the CNN using transfer learning for exceptional accuracy and robustness.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 4 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 4</Badge>
                        Deployment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Deploy the model to cloud and edge infrastructures for scalable, real-time inference.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 5 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 5</Badge>
                        Monitoring & Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Continuously monitor performance and incorporate feedback for ongoing enhancements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 6 */}
                <div className="min-w-[250px] flex-shrink-0 transition-transform duration-300 hover:scale-105">
                  <Card className="p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">Step 6</Badge>
                        Iterative Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Regularly update the system based on new data, research insights, and evolving conditions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </MotionDiv>
          </section>

          {/* In-Depth Analysis & Future Roadmap Section */}
          <section className="mb-20">
            <MotionDiv {...fadeIn}>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">In-Depth Analysis & Future Roadmap</h2>
              <hr className="border-gray-300 mb-8" />
              <p className="text-gray-600 mb-6">
                The PlantPath AI platform is engineered to evolve continuously, adapting to emerging agricultural challenges.
                Future enhancements include integrating advanced analytics, bolstering security, and forging strategic partnerships with global agri-tech leaders.
              </p>
              <p className="text-gray-600">
                Its modular design allows independent updates for each component—from data ingestion and preprocessing to model training and real-time deployment—ensuring flexibility and scalability.
                Collaboration with research institutions and user feedback will further propel innovations in AI-driven agriculture.
              </p>
            </MotionDiv>
          </section>
        </div>
      </div>
    </Layout>
  );
};
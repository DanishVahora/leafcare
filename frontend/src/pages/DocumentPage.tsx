import { BookOpen, BrainCircuit, Factory, LeafyGreen, Network, TestTube2, Wheat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <div className="bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-16">
          {/* Page Header */}
          <MotionDiv {...fadeIn} className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-green-100">
                <LeafyGreen className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                PlantPath AI - Technical Documentation
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade plant disease detection system powered by deep learning.
            </p>
          </MotionDiv>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 h-auto bg-green-50">
              <TabsTrigger value="overview" className="py-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="architecture">
                <Network className="w-4 h-4 mr-2" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="methodology">
                <TestTube2 className="w-4 h-4 mr-2" />
                Methodology
              </TabsTrigger>
              <TabsTrigger value="integration" className="py-4">
                <BrainCircuit className="w-4 h-4 mr-2" />
                Model Integration
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Wheat className="w-6 h-6 text-green-600" />
                      Problem Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Agricultural productivity faces significant threats from plant diseases, 
                      causing up to 40% crop loss annually. Current manual detection methods 
                      are time-consuming and require expert knowledge, creating a need for 
                      automated, scalable solutions.
                    </p>
                    <Badge variant="outline" className="mt-4 bg-green-100">
                      Market Need
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <BrainCircuit className="w-6 h-6 text-green-600" />
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

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Factory className="w-6 h-6 text-green-600" />
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
                    <div className="mt-4 bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">
                        Compatible with IoT devices and farm management systems.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional Overview Content */}
              <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Extended Project Background</h2>
                <p className="text-gray-600">
                  The PlantPath AI platform is the result of extensive research in computer vision and agricultural sciences. It leverages the power of modern deep learning techniques to accurately diagnose and predict plant diseases, thereby enabling proactive measures and reducing the economic impact on farmers.
                </p>
                <p className="text-gray-600">
                  By automating the detection process, the system not only saves valuable time but also ensures consistent and reliable results even under challenging conditions. Continuous model updates and feedback loops help the system evolve with emerging disease patterns.
                </p>
              </div>
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture">
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-6">System Architecture</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-4">Model Structure</h4>
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
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">Performance Metrics</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Training Accuracy</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-green-600 h-2.5 rounded-full w-[98.7%]"/>
                            </div>
                            <span className="text-green-600 font-medium">98.7%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Validation Accuracy</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-green-600 h-2.5 rounded-full w-[94.2%]"/>
                            </div>
                            <span className="text-green-600 font-medium">94.2%</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Badge className="bg-green-100 text-green-700">Inference Time: 120ms</Badge>
                          <Badge className="bg-green-100 text-green-700">Model Size: 65MB</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-6">Data Pipeline</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-4">Dataset Structure</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li>• 38 Plant Species</li>
                        <li>• 87 Disease Classes</li>
                        <li>• 150,000+ Images</li>
                        <li>• 70-30 Train-Validation Split</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Preprocessing</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Resize: 128x128</Badge>
                          <Badge variant="outline">Normalization</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Augmentation</Badge>
                          <Badge variant="outline">Batch: 32</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Methodology Tab */}
            <TabsContent value="methodology">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-6">Training Methodology</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Optimization Strategy</h4>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Adam Optimizer (lr=0.0001)</li>
                        <li>Categorical Cross-Entropy Loss</li>
                        <li>Early Stopping</li>
                        <li>L2 Regularization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Hardware Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-green-100">
                          NVIDIA A100 GPUs
                        </Badge>
                        <Badge variant="outline" className="bg-green-100">
                          Distributed Training
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
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
            </TabsContent>

            {/* Model Integration Tab */}
            <TabsContent value="integration">
              <div className="space-y-12">
                {/* Features Section */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Project Features</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <BrainCircuit className="w-6 h-6 text-green-600" />
                          Automated Model Updates
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Seamlessly integrate new training data to continuously improve detection accuracy.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Factory className="w-6 h-6 text-green-600" />
                          Scalable Deployment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Deploy the model across cloud infrastructures and IoT devices for real-time monitoring.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <TestTube2 className="w-6 h-6 text-green-600" />
                          Real-Time Feedback Loop
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Integrate with farm management systems to provide instant insights and proactive alerts.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Use Cases Section */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Use Cases</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Wheat className="w-6 h-6 text-green-600" />
                          Precision Farming
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Enable farmers to make informed decisions with timely disease detection, predictive analytics, and tailored treatment recommendations.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <LeafyGreen className="w-6 h-6 text-green-600" />
                          Crop Insurance & Risk Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Leverage insights for efficient claims processing, risk assessment, and tailored insurance products.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Network className="w-6 h-6 text-green-600" />
                          Research & Development
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Support academic and industrial research with a robust dataset and state-of-the-art model architecture.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <BookOpen className="w-6 h-6 text-green-600" />
                          Educational Platforms
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Serve as a comprehensive case study in AI-driven agriculture for universities and training institutes.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <TestTube2 className="w-6 h-6 text-green-600" />
                          Real-Time Crop Monitoring
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Monitor crop health in real-time using IoT devices combined with our AI model to alert farmers instantly.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Workflow Steps Section with Horizontal Scroll */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Workflow Steps</h3>
                  <p className="text-gray-600 mb-4">
                    Follow the step-by-step workflow to understand how data is transformed into actionable insights:
                  </p>
                  <div className="flex space-x-4 overflow-x-auto py-4">
                    {/* Step 1 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 1</Badge>
                            Data Collection
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Gather large-scale image datasets from farms, satellites, and IoT sensors.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Step 2 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 2</Badge>
                            Preprocessing
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Clean, resize, and augment images to prepare them for model ingestion.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Step 3 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 3</Badge>
                            Model Training
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Train the CNN using transfer learning, optimizing for high accuracy and robustness.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Step 4 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 4</Badge>
                            Deployment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Deploy the model to cloud infrastructures and edge devices for scalable inference.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Step 5 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 5</Badge>
                            Monitoring & Feedback
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Continuously monitor model performance and incorporate user feedback for iterative improvements.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    {/* Step 6 */}
                    <div className="min-w-[250px] flex-shrink-0">
                      <Card className="p-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-700">Step 6</Badge>
                            Iterative Improvement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            Update the system regularly based on new data, research insights, and evolving disease patterns.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Additional Analysis Section */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">In-Depth Analysis & Future Roadmap</h3>
                  <p className="text-gray-600 mb-4">
                    The PlantPath AI platform is designed to evolve continuously, adapting to new challenges in the agricultural sector. Future plans include integrating advanced analytics, enhanced security features, and extended partnerships with global agri-tech companies.
                  </p>
                  <p className="text-gray-600 mb-4">
                    By leveraging a modular architecture, the platform ensures each component—from data ingestion and preprocessing to model training and real-time integration—can be updated independently. This provides the flexibility to adopt the latest technologies and best practices as the domain evolves.
                  </p>
                  <p className="text-gray-600">
                    Additionally, user feedback and collaboration with research institutions will drive future enhancements, ensuring the solution remains at the forefront of AI-powered agricultural innovation.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

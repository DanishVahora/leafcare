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
              Enterprise-grade plant disease detection system powered by deep learning
            </p>
          </MotionDiv>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto bg-green-50">
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
                        Compatible with IoT devices and farm management systems
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};
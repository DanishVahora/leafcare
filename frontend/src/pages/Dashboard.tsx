// pages/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  Upload, 
  History, 
  Leaf, 
  AlertCircle, 
  CheckCircle2, 
  Camera,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Analysis {
  id: string;
  date: string;
  plant: string;
  status: string;
  disease: string;
  confidence: number;
  imageUrl: string;
}

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  
  // Mock data for recent analyses
  const recentAnalyses: Analysis[] = [
    {
      id: '1',
      date: '2024-01-12',
      plant: 'Tomato',
      status: 'Healthy',
      disease: 'None',
      confidence: 98.5,
      imageUrl: '/api/placeholder/100/100'
    },
    {
      id: '2',
      date: '2024-01-11',
      plant: 'Rose',
      status: 'Diseased',
      disease: 'Black Spot',
      confidence: 95.2,
      imageUrl: '/api/placeholder/100/100'
    },
    // Add more mock data as needed
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Handle the file upload
      console.log('File uploaded:', files[0]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plant Health Dashboard</h1>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Camera className="w-5 h-5" />
            New Analysis
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy Plants</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Diseases Detected</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">97.8%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Analyze New Plant</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your image here, or</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Choose File
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPG, PNG, HEIC
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analysis */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Analysis</CardTitle>
              <History className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <img 
                      src={analysis.imageUrl} 
                      alt={analysis.plant} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{analysis.plant}</p>
                      <p className="text-sm text-gray-500">{analysis.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysis.status === 'Healthy' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysis.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{analysis.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
                View All Analysis
              </button>
            </CardContent>
          </Card>

          {/* Common Diseases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Common Diseases</CardTitle>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add disease statistics here */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Black Spot</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                {/* Add more disease stats */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
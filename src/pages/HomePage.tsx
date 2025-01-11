import React from 'react';
import { ArrowRight, Shield, Upload, FileSearch } from 'lucide-react';
import Layout from '../Layout/Layout';
export default function HomePage() {
  return (
    
    <Layout>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-y-36">
          {/* Left side content */}
          <div className="flex-0 space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-800 text-sm font-medium">AI-Powered Solution</span>
              <span className="px-2 py-1 bg-green-200 rounded-full text-xs text-green-800">New</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Plant Disease Detection
              <span className="block text-green-600 mt-2">Made Simple</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Protect your crops with AI-powered disease detection. Upload photos of your plants and get instant analysis and treatment recommendations.
            </p>

            <div className="flex items-center gap-4">
              <button className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                Get Started 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 text-green-600 hover:text-green-700 px-6 py-4 rounded-xl text-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Easy Upload</h3>
                <p className="text-sm text-gray-600">Quick and simple photo upload process</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Instant Analysis</h3>
                <p className="text-sm text-gray-600">Get results in seconds</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Expert Solutions</h3>
                <p className="text-sm text-gray-600">Professional treatment advice</p>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className=" h-full flex items-center">
            <div className="relative h-3/4">
              {/* <div className="absolute inset-0 bg-gradient-to-t from-green-100 to-transparent rounded-3xl"></div> */}
              <img 
                src="https://images.pexels.com/photos/5858235/pexels-photo-5858235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Plant Disease Detection" 
                className="rounded-3xl shadow-2xl w-full object-cover h-full"
              />
              {/* Stats overlay */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">50k+</div>
                    <div className="text-sm text-gray-600">Plants Analyzed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
  );
}
import React, { useState, useCallback, useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Link, Image, TestTube2, AlertCircle, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

const classNames = [
  'Apple__Apple_scab', 'Apple_Black_rot', 'Apple_Cedar_apple_rust', 'Apple_healthy',
  // ... (all your class names here)
  'Tomato__healthy'
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DetectionPage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preprocessedImage, setPreprocessedImage] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Image preprocessing similar to training
  const preprocessImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set to training dimensions
    canvas.width = 128;
    canvas.height = 128;
    
    // Draw and process image
    ctx?.drawImage(img, 0, 0, 128, 128);
    const imageData = ctx?.getImageData(0, 0, 128, 128);
    
    // Convert to array compatible with model
    const processedArray = new Float32Array(128 * 128 * 3);
    if (imageData) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        processedArray[i/4 * 3] = imageData.data[i] / 255;     // R
        processedArray[i/4 * 3 + 1] = imageData.data[i+1] / 255; // G
        processedArray[i/4 * 3 + 2] = imageData.data[i+2] / 255; // B
      }
    }
    
    // Show preview of processed image
    setPreprocessedImage(canvas.toDataURL());
    
    return Array.from(processedArray);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        setImageSrc(img.src);
        preprocessImage(img);
      };
    };
    reader.readAsDataURL(file);
  }, [preprocessImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleUrlSubmit = async () => {
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        setImageSrc(url);
        preprocessImage(img);
      };
    } catch (err) {
      setError("Invalid image URL");
    }
  };

  const handleDetection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      const blob = await fetch(imageSrc!).then(r => r.blob());
      formData.append('file', blob, 'image.jpg');

      const response = await fetch(
        "https://plant-diesase.kindmushroom-20b564e6.centralindia.azurecontainerapps.io/predict/",
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Error processing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-8 flex items-center gap-3">
            <TestTube2 className="w-8 h-8" />
            Plant Disease Detection
          </h1>

          {/* Input Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* URL Input */}
            <Card className="p-6 shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-green-700 mb-4">
                  <Link className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">Image URL</h3>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste image URL here"
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <Button onClick={handleUrlSubmit} className="gap-2">
                  Load URL
                  <Image className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Upload Box */}
            <Card className="p-6 shadow-lg">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-8 h-8 text-green-600" />
                  <p className="text-gray-600">
                    {isDragActive ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <Badge variant="outline">Supports JPG, PNG</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Image Previews */}
          {imageSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              <Card className="p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Original Image</h3>
                <img
                  src={imageSrc}
                  alt="Uploaded plant"
                  className="rounded-lg max-h-64 object-contain mx-auto"
                />
              </Card>
              
              <Card className="p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Preprocessed Image</h3>
                {preprocessedImage && (
                  <img
                    src={preprocessedImage}
                    alt="Preprocessed"
                    className="rounded-lg max-h-64 object-contain mx-auto"
                  />
                )}
              </Card>
            </motion.div>
          )}

          {/* Detection Controls */}
          {imageSrc && (
            <div className="text-center mb-12">
              <Button
                onClick={handleDetection}
                disabled={loading}
                size="lg"
                className="gap-2 px-8 py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Detect Disease
                    <TestTube2 className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <Card className="p-6 shadow-lg mb-8">
              <div className="space-y-6">
                {results.error ? (
                  <div className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {results.error}
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-green-800 mb-2">
                        Detection Results
                      </h2>
                      <Badge variant="outline" className="text-lg py-1 px-3">
                        Confidence: {(results.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-4 text-green-700">
                        {results.prediction.replace(/_/g, ' ')}
                      </h3>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-800">Top Predictions:</h4>
                        {results.top_3_predictions.map((pred: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <span className="text-gray-700">
                              {pred.class.replace(/_/g, ' ')}
                            </span>
                            <Badge variant="secondary">
                              {(pred.confidence * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isSubscribed ? (
                      <Button variant="link" className="text-green-600 gap-2">
                        Learn about treatment methods
                        <Lock className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="text-center text-gray-600">
                        <p className="mb-2">Subscribe for detailed treatment information</p>
                        <Button variant="default">
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="text-red-600 flex items-center gap-2 mt-4">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default DetectionPage;
import React, { useState, useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Volume2, 
  VolumeX,
  TestTube2,
  AlertCircle,
  Image as ImageIcon,
  Shield,
  BookOpen,
  ShoppingBag,
  Sprout,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";

interface DetectionRecord {
  id: string;
  date: string;
  imageSrc: string;
  prediction: string;
  confidence: number;
  treatmentInfo: any;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HistoryPage: React.FC = () => {
  const [detectionHistory, setDetectionHistory] = useState<DetectionRecord[]>([]);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [readingId, setReadingId] = useState<string | null>(null);
  const [speechSynthRef, setSpeechSynthRef] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('plantDetectionHistory');
    if (savedHistory) {
      setDetectionHistory(JSON.parse(savedHistory));
    } else {
      setDetectionHistory(dummyDetectionHistory);
      localStorage.setItem('plantDetectionHistory', JSON.stringify(dummyDetectionHistory));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (speechSynthRef) window.speechSynthesis.cancel();
    };
  }, [speechSynthRef]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRecords);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedRecords(newExpanded);
  };

  const deleteRecord = (id: string) => {
    const updatedHistory = detectionHistory.filter(record => record.id !== id);
    setDetectionHistory(updatedHistory);
    localStorage.setItem('plantDetectionHistory', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all detection history?")) {
      setDetectionHistory([]);
      localStorage.removeItem('plantDetectionHistory');
    }
  };

  const handleReadAloud = (record: DetectionRecord) => {
    if (!record.treatmentInfo?.originalText) return;
    
    if (readingId === record.id) {
      window.speechSynthesis.cancel();
      setReadingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(record.treatmentInfo.originalText);
    utterance.onend = () => setReadingId(null);
    setReadingId(record.id);
    window.speechSynthesis.speak(utterance);
  };

  const renderTreatmentInfo = (treatmentInfo: any) => {
    if (!treatmentInfo) return null;

    const SectionHeader = ({ title }: { title: string }) => (
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
        <div className="p-2 rounded-full bg-green-100">
          {sectionIcons[title as keyof typeof sectionIcons] || <Sprout className="w-5 h-5 text-green-600" />}
        </div>
        <h3 className="text-xl font-semibold text-green-800">{title}</h3>
      </div>
    );

    const sectionIcons: { [key: string]: JSX.Element } = {
      "About The Disease": <AlertCircle className="w-5 h-5 text-amber-600" />,
      "Identification Signs": <ImageIcon className="w-5 h-5 text-red-600" />,
      "Immediate Control Measures": <TestTube2 className="w-5 h-5 text-blue-600" />,
      "Organic Solutions": <span className="text-2xl">🌱</span>,
      "Chemical Treatments": <Shield className="w-5 h-5 text-purple-600" />,
      "Prevention Tips": <span className="text-2xl">🛡️</span>,
      "Recommended Products": <ShoppingBag className="w-5 h-5 text-orange-600" />,
      "Educational Resources": <BookOpen className="w-5 h-5 text-indigo-600" />
    };

    return (
      <div className="space-y-8 mt-4">
        {Object.entries(treatmentInfo)
          .filter(([key]) => key !== 'originalText')
          .map(([section, items]) => (
            <div key={section} className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader title={section} />
              <div className="space-y-4 pl-4 border-l-4 border-green-100">
                {Array.isArray(items) && items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-1 text-green-600">•</span>
                    <p className="text-gray-700">{typeof item === 'object' ? item.name || item.text : item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 flex items-center gap-3">
              <Clock className="w-8 h-8" />
              Detection History
            </h1>
            {detectionHistory.length > 0 && (
              <Button onClick={clearAllHistory} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {detectionHistory.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <p className="text-gray-500 text-lg">No detection history found</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {detectionHistory.map((record) => (
                <Card key={record.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <img src={record.imageSrc} alt={record.prediction} 
                             className="w-20 h-20 object-cover rounded-lg" />
                        <div>
                          <h3 className="text-xl font-semibold text-green-800">
                            {record.prediction.replace(/_/g, ' ')}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{record.date}</span>
                            <Badge variant="outline" className="ml-2">
                              {(record.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => deleteRecord(record.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleExpand(record.id)}>
                          {expandedRecords.has(record.id) ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </div>
                    </div>

                    {expandedRecords.has(record.id) && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Treatment Guide</h3>
                          <Button
                            variant="outline"
                            onClick={() => handleReadAloud(record)}
                            className={readingId === record.id ? 'bg-red-50' : 'bg-green-50'}
                          >
                            {readingId === record.id ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {renderTreatmentInfo(record.treatmentInfo)}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

const dummyDetectionHistory: DetectionRecord[] = [
  {
    id: '1',
    date: '2024-03-15',
    imageSrc: 'https://example.com/leaf1.jpg',
    prediction: 'Tomato_Early_Blight',
    confidence: 0.92,
    treatmentInfo: {
      "About The Disease": ["Fungal disease affecting tomato leaves"],
      "Immediate Control Measures": ["Remove infected leaves", "Apply copper fungicide"],
      "Organic Solutions": ["Neem oil spray every 7 days"],
      originalText: "Tomato Early Blight is a common fungal disease..."
    }
  },
  {
    id: '2',
    date: '2024-03-14',
    imageSrc: 'https://example.com/leaf2.jpg',
    prediction: 'Potato_Late_Blight',
    confidence: 0.87,
    treatmentInfo: {
      "About The Disease": ["Destructive fungal disease affecting potatoes"],
      "Immediate Control Measures": ["Destroy infected plants", "Apply chlorothalonil"],
      "Organic Solutions": ["Baking soda spray"],
      originalText: "Potato Late Blight is a serious disease..."
    }
  }
];

export default HistoryPage;
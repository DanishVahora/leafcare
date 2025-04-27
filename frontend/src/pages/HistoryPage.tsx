import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/Layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  History as HistoryIcon,
  Sparkles,
  X,
  Info,
  AlertCircle,
  Image,
  TestTube2,
  Shield,
  ShoppingBag,
  BookOpen,
  Volume2,
  VolumeX,
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface HistoryEntry {
  _id: string;
  image: string;
  prediction: {
    disease: string;
    confidence: number;
    top_3_predictions: Array<{
      class: string;
      confidence: number;
    }>;
  };
  treatmentInfo: any;
  createdAt: string;
}

const fetchTreatmentInfo = async (disease: string): Promise<any> => {
  const prompt = `As an agricultural expert specializing in plant diseases in India, provide detailed treatment information for ${disease} in plants. Focus on practical, actionable advice that farmers can implement immediately.

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

**About The Disease:**
- [Brief description of what the disease is]
- [How it spreads]
- [What crops it typically affects]

**Identification Signs:**
- [List 3-4 key visual symptoms that confirm the disease]

**Immediate Control Measures:**
- [Most urgent action to take]
- [Second urgent action]
- [Third urgent action]

**Organic Solutions:**
- [Specific organic treatment 1]: [Exact application method and frequency]
- [Specific organic treatment 2]: [Exact application method and frequency]

**Chemical Treatments:**
- [Specific Indian-available fungicide/pesticide name]: [Exact concentration and application method]
- [Alternative chemical name]: [Exact concentration and application method]

**Prevention Tips:**
- [Specific preventive measure 1]
- [Specific preventive measure 2]
- [Specific preventive measure 3]

**Recommended Products:**
- [Specific Indian brand name]: [Brief description and approximate price]
- [Specific Indian brand name]: [Brief description and approximate price]

**Educational Resources:**
- [Link to a specific YouTube video about managing this disease]
- [Link to an Indian agricultural extension service document]
- [Link to a mobile app that helps identify or treat this disease]

Use straightforward language appropriate for farmers with basic education. Prioritize treatments available in rural Indian markets. For chemical treatments, include safety precautions.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    }
  );

  if (!response.ok) throw new Error('API request failed');
  const data = await response.json();
  const treatmentText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Enhanced parse function for better structure
  const parseGeminiResponse = (text: string) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/^[-•]/gm, '').trim();
    const sections = cleanText.split(/\n(?=[A-Z][^:]+:)/g).filter(s => s.trim().length > 0);
    const result: Record<string, any> = {};

    sections.forEach(section => {
      const [title, ...content] = section.split(':');
      if (title && content) {
        const sectionTitle = title.trim();
        const items = content.join(':').split(/\n/)
          .map(item => item.trim())
          .filter(item => item.length > 0);

        if (sectionTitle === "Recommended Products") {
          result[sectionTitle] = items.map(item => {
            const [name, ...rest] = item.split(/:\s*/);
            return { name, description: rest.join(': ') };
          });
        } else if (sectionTitle === "Educational Resources") {
          result[sectionTitle] = items.map(item => {
            const urlMatch = item.match(/(https?:\/\/[^\s]+)/);
            return {
              text: urlMatch ? item.replace(urlMatch[0], '').trim() : item,
              url: urlMatch?.[0]
            };
          });
        } else {
          result[sectionTitle] = items;
        }
      }
    });

    result.originalText = cleanText;
    return result;
  };

  return parseGeminiResponse(treatmentText);
};

const sectionIcons: Record<string, React.ReactNode> = {
  "About The Disease": <AlertCircle className="w-5 h-5 text-amber-600" />,
  "Identification Signs": <Image className="w-5 h-5 text-red-600" />,
  "Immediate Control Measures": <TestTube2 className="w-5 h-5 text-blue-600" />,
  "Organic Solutions": <span className="text-2xl">🌱</span>,
  "Chemical Treatments": <Shield className="w-5 h-5 text-purple-600" />,
  "Prevention Tips": <span className="text-2xl">🛡️</span>,
  "Recommended Products": <ShoppingBag className="w-5 h-5 text-orange-600" />,
  "Educational Resources": <BookOpen className="w-5 h-5 text-indigo-600" />
};

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [minConfidence, setMinConfidence] = useState('');
  const [maxConfidence, setMaxConfidence] = useState('');

  // Filtered history based on search and filters
  const filteredHistory = history.filter(entry => {
    // Filter by name
    const matchesName = entry.prediction.disease.replace(/_/g, ' ').toLowerCase().includes(search.toLowerCase());
    // Filter by date
    const matchesDate = filterDate
      ? format(new Date(entry.createdAt), 'yyyy-MM-dd') === filterDate
      : true;
    // Filter by confidence
    const conf = entry.prediction.confidence * 100;
    const matchesMin = minConfidence ? conf >= Number(minConfidence) : true;
    const matchesMax = maxConfidence ? conf <= Number(maxConfidence) : true;
    return matchesName && matchesDate && matchesMin && matchesMax;
  });

  // Treatment dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogTreatment, setDialogTreatment] = useState<any>(null);
  const [dialogDisease, setDialogDisease] = useState<string>('');
  const [isReading, setIsReading] = useState(false);

  // Function to handle scrolling when dialog is opened
  useEffect(() => {
    if (showDialog) {
      // Prevent background scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when dialog is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [showDialog]);

  // Click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowDialog(false);
      }
    };

    if (showDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDialog]);

  // Fix for mouse wheel scrolling in dialog
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    const dialogContent = dialogContentRef.current;
    if (showDialog && dialogContent) {
      dialogContent.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (dialogContent) {
        dialogContent.removeEventListener('wheel', handleWheel);
      }
    };
  }, [showDialog, dialogTreatment]);

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/history?page=${page}`);
      setHistory(response.data.history);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      setError('Failed to fetch history');
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory(1);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    console.log('handleDelete called with id:', id);
    try {
      await api.delete(`/history/${id}`);
      toast.success('History entry deleted');
      fetchHistory(currentPage);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete history entry');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all history? This cannot be undone.')) return;
    try {
      await api.delete('/history');
      toast.success('All history deleted');
      fetchHistory(1);
    } catch (error) {
      toast.error('Failed to delete all history');
    }
  };

  const handleGenerateTreatment = async (disease: string) => {
    setShowDialog(true);
    setDialogLoading(true);
    setDialogError(null);
    setDialogTreatment(null);
    setDialogDisease(disease);
    try {
      const treatment = await fetchTreatmentInfo(disease);
      setDialogTreatment(treatment);
    } catch (err) {
      setDialogError('Failed to generate treatment guide. Please try again.');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!dialogTreatment) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const text = Object.entries(dialogTreatment)
      .filter(([key]) => key !== 'originalText')
      .map(([section, items]) => `${section}: ${(items as string[]).join('. ')}`)
      .join('. ');
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const renderTreatmentDialog = () => (
    <AnimatePresence>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* Backdrop with blur effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/40"
            onClick={() => setShowDialog(false)}
          />
          
          {/* Dialog content */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-50 dark:bg-green-900/30 px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                  Treatment Guide
                </h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-green-100 dark:hover:bg-green-800/50"
                onClick={() => setShowDialog(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Disease name banner */}
            <div className="bg-green-100/50 dark:bg-green-800/20 px-6 py-3">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300">
                {dialogDisease.replace(/_/g, ' ')}
              </h3>
            </div>
            
            {/* Content */}
            <div 
              ref={dialogContentRef}
              className="px-6 py-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-800"
            >
              {dialogLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-100 dark:bg-green-800/30 rounded-full animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
                    <Loader2 className="w-10 h-10 animate-spin text-green-600 dark:text-green-400 relative" />
                  </div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Generating comprehensive treatment guide...</span>
                </div>
              ) : dialogError ? (
                <div className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                    <Info className="text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-red-600 dark:text-red-400">{dialogError}</p>
                  <Button 
                    className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" 
                    onClick={() => handleGenerateTreatment(dialogDisease)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : dialogTreatment ? (
                <div className="space-y-6">
                  {["About The Disease", "Identification Signs", "Immediate Control Measures", "Organic Solutions", "Chemical Treatments", "Prevention Tips", "Recommended Products", "Educational Resources"].map((section) => {
                    const items = dialogTreatment[section];
                    if (!items || !Array.isArray(items) || items.length === 0) return null;
              
                    return (
                      <div key={section} className="bg-white dark:bg-white rounded-xl shadow p-5 border border-green-100 dark:border-green-900">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-xl">
                            {sectionIcons[section] || <Sprout className="w-5 h-5" />}
                          </span>
                          <span className="text-green-800 dark:text-green-200 font-semibold text-base">
                            {section}
                          </span>
                        </div>
                        <div className="space-y-2 pl-2">
                          {section === "Recommended Products" &&
                            items.map((item: any, idx: number) =>
                              item?.name ? (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 text-orange-500">🛒</span>
                                  <div>
                                    <div className="font-medium text-orange-800">{item.name}</div>
                                    <div className="text-gray-600 text-sm">{item.description}</div>
                                  </div>
                                </div>
                              ) : null
                            )
                          }
                          {section === "Educational Resources" &&
                            items.map((item: any, idx: number) =>
                              item?.text && item?.url ? (
                                <div key={idx} className="flex items-start gap-2 group">
                                  <span className="mt-1 text-indigo-600">🔗</span>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                                  >
                                    {item.text}
                                    <span className="ml-2 text-indigo-400 text-xs">(click to open)</span>
                                  </a>
                                </div>
                              ) : null
                            )
                          }
                          {section === "Immediate Control Measures" &&
                            items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full">
                                  {idx + 1}
                                </div>
                                <div className="text-gray-700">{String(item)}</div>
                              </div>
                            ))
                          }
                          {["About The Disease", "Identification Signs", "Organic Solutions", "Chemical Treatments", "Prevention Tips"].includes(section) &&
                            items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="mt-1 text-green-600">•</span>
                                <div className="text-gray-700">{String(item)}</div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-3 text-amber-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Important Notes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                          <li>Always wear protective gear when handling chemicals</li>
                          <li>Test treatments on small areas first</li>
                          <li>Consult local agricultural experts for specific advice</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            
            {/* Footer */}
            {!dialogLoading && !dialogError && dialogTreatment && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  Generated with AI - Information may need verification
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-2 border-green-600"
                    onClick={handleReadAloud}
                    disabled={!dialogTreatment || dialogLoading}
                  >
                    {isReading ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Stop Reading
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Read Aloud
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" 
                    onClick={() => setShowDialog(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Rest of your component remains the same...
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Please login to view your history
            </h2>
            <Button onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HistoryIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Detection History</h1>
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="ml-auto bg-red-500 hover:bg-red-600"
              onClick={handleDeleteAll}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          )}
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by disease name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-64"
          />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Min % Confidence"
            value={minConfidence}
            min={0}
            max={100}
            onChange={e => setMinConfidence(e.target.value)}
            className="border rounded px-3 py-2 w-32"
          />
          <input
            type="number"
            placeholder="Max % Confidence"
            value={maxConfidence}
            min={0}
            max={100}
            onChange={e => setMaxConfidence(e.target.value)}
            className="border rounded px-3 py-2 w-32"
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setFilterDate('');
              setMinConfidence('');
              setMaxConfidence('');
            }}
            className="ml-0 md:ml-2"
          >
            Clear
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">{error}</Card>
        ) : history.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl text-gray-600">No detection history found</h2>
          </Card>
        ) : (
          <>
            <div className="grid gap-6">
              {filteredHistory.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={entry.image}
                          alt="Plant"
                          className="rounded-lg max-h-64 object-cover w-full"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-green-800">
                              {entry.prediction.disease.replace(/_/g, ' ')}
                            </h3>
                            <Badge className="mt-2">
                              {(entry.prediction.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                            onClick={() => handleGenerateTreatment(entry.prediction.disease)}
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate Treatment Guide
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            type="button"
                            onClick={() => {
                              console.log('Delete button clicked for', entry._id);
                              handleDelete(entry._id);
                            }}
                            className="gap-2 bg-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchHistory(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchHistory(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {renderTreatmentDialog()}
      </div>
    </Layout>
  );
};

export default HistoryPage;

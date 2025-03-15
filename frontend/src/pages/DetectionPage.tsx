import React, { useState, useCallback, useRef, useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Link as LinkIcon, 
  Image, 
  TestTube2, 
  AlertCircle, 
  Loader2, 
  Volume2, 
  VolumeX, 
  Shield, 
  ShoppingBag, 
  BookOpen,
  Sprout,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuth } from "@/context/AuthContext";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

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
  const [treatmentInfo, setTreatmentInfo] = useState<any>(null);
  const [loadingTreatment, setLoadingTreatment] = useState(false);
  const [treatmentError, setTreatmentError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Add this state to track when a scan is in progress
  const [scanInProgress, setScanInProgress] = useState(false);
 
  // Access management
  const { isAuthenticated, user } = useAuth();
  const { canAccessFeature, usageCount } = useFeatureAccess();
  const [accessGranted, setAccessGranted] = useState(true);
  const { trackUsage } = useSubscription();
  const [userScansRemaining, setUserScansRemaining] = useState<number | null>(null);

  // Check initial access based on user state
  useEffect(() => {
    setAccessGranted(canAccessFeature('scan'));
  }, [canAccessFeature, isAuthenticated, user]);

  // Fetch remaining scan count for authenticated users
  useEffect(() => {
    const fetchUserScanData = async () => {
      if (isAuthenticated && user) {
        try {
          // For authenticated users, calculate remaining scans
          const scanThisMonth = user.usageStats?.scanThisMonth || 0;
          const remaining = user.role === 'pro' ? Infinity : 5 - scanThisMonth;
          setUserScansRemaining(remaining);
        } catch (error) {
          console.error("Error fetching scan data", error);
        }
      }
    };
    
    fetchUserScanData();
  }, [isAuthenticated, user]);

  const preprocessImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;
    ctx?.drawImage(img, 0, 0, 128, 128);
    const imageData = ctx?.getImageData(0, 0, 128, 128);
    const processedArray = new Float32Array(128 * 128 * 3);
    if (imageData) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        processedArray[i/4 * 3] = imageData.data[i] / 255;
        processedArray[i/4 * 3 + 1] = imageData.data[i+1] / 255;
        processedArray[i/4 * 3 + 2] = imageData.data[i+2] / 255;
      }
    }
    setPreprocessedImage(canvas.toDataURL());
    return Array.from(processedArray);
  }, []);

  // Add a function to check if a new scan is allowed
  const canPerformNewScan = useCallback(() => {
    // If a scan is already in progress or completed in this session, don't allow new scans for guests
    if (!isAuthenticated && (scanInProgress || usageCount >= 1)) {
      setAccessGranted(false);
      return false;
    }
    
    // For authenticated users, check their monthly limits using the real-time data
    if (isAuthenticated && user?.role !== 'pro') {
      if (userScansRemaining !== null && userScansRemaining <= 0) {
        setAccessGranted(false);
        return false;
      }
    }
    
    return true;
  }, [isAuthenticated, scanInProgress, usageCount, user, userScansRemaining]);

  // Update the handleDetection function
  const handleDetection = async () => {
    // Set the scan in progress flag to true
    setScanInProgress(true);
    
    setLoading(true);
    setError(null);
    setTreatmentInfo(null);
    
    try {
      const formData = new FormData();
      const blob = await fetch(imageSrc!).then(r => r.blob());
      formData.append('file', blob, 'image.jpg');

      const response = await fetch(
        "https://plant-diesase.kindmushroom-20b564e6.centralindia.azurecontainerapps.io/predict/",
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      
      if (data && data.prediction) {
        setResults(data);
        await fetchTreatmentInfo(data.prediction.replace(/_/g, ' '));
        
        // Record usage based on authentication status
        if (isAuthenticated) {
          // For authenticated users, track via API
          try {
            await trackUsage('scan');
            // Update local state to reflect the new scan count
            if (userScansRemaining !== null && userScansRemaining !== Infinity) {
              setUserScansRemaining(userScansRemaining - 1);
            }
          } catch (error) {
            console.error("Failed to track scan usage", error);
            toast.error("Failed to update scan count. Your usage may not be properly tracked.");
          }
        } else {
          // For guests, track locally (existing code)
          const newCount = usageCount + 1;
          localStorage.setItem('guestPredictionCount', newCount.toString());
        }
      } else {
        throw new Error('Invalid prediction response');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : "Error processing image. Please try again.");
      // If there's an error, we'll set scanInProgress back to false
      setScanInProgress(false);
    } finally {
      setLoading(false);
      // We don't reset scanInProgress here because we want to keep tracking
      // that a scan has been performed
    }
  };

  // Add a reset function that can be called if needed
  // const resetScan = () => {
  //   setImageSrc(null);
  //   setPreprocessedImage(null);
  //   setResults(null);
  //   setTreatmentInfo(null);
  //   setError(null);
  //   setScanInProgress(false);
  // };

  // Modify onDrop to use the new access check
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if user can perform a new scan
    if (!canPerformNewScan()) {
      return;
    }
    
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
  }, [preprocessImage, canPerformNewScan]);

  // Update handleUrlSubmit to use the new access check
  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Check access before proceeding
    if (!canPerformNewScan()) {
      return;
    }

    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      
      img.onload = () => {
        setImageSrc(url);
        preprocessImage(img);
      };

      img.onerror = () => {
        setError("Failed to load image from URL");
      };
    } catch (err) {
      setError("Invalid image URL");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  // Enhanced parse function for better structure
  const parseGeminiResponse = (text: string) => {
    // First, clean up the text by removing asterisks and dashes
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

        // Special handling for complex sections
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

    // Store clean text for speech
    result.originalText = cleanText;
    
    return result;
  };

  // Enhanced treatment info fetcher with more comprehensive content
  const fetchTreatmentInfo = async (disease: string) => {
    setLoadingTreatment(true);
    setTreatmentError(null);
    try {
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
            contents: [{
              parts: [{ text: prompt }]
            }],
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
      
      const treatmentText = data.candidates[0].content.parts[0].text;
      const parsedTreatment = parseGeminiResponse(treatmentText);
      
      // Keep the original text for read-aloud feature
      parsedTreatment.originalText = treatmentText.replace(/\*\*/g, '');
      
      setTreatmentInfo(parsedTreatment);
    } catch (err) {
      setTreatmentError("Failed to fetch treatment information. Please try again.");
    } finally {
      setLoadingTreatment(false);
    }
  };

  const handleReadAloud = () => {
    if (!treatmentInfo || !treatmentInfo.originalText) return;
    
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
  
    // Load voices first
    const loadVoices = () => {
      return new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
          };
        }
      });
    };
  
    const startSpeaking = async () => {
      try {
        setIsReading(true);
        const voices = await loadVoices();
        
        // Create a clean text version for reading
        const textToRead = Object.entries(treatmentInfo)
          .filter(([key]) => key !== 'originalText')
          .map(([section, items]) => {
            if (Array.isArray(items)) {
              const itemsText = items
                .map(item => {
                  if (typeof item === 'string') return item;
                  if (item.name) return `${item.name}: ${item.description}`;
                  if (item.text) return item.text;
                  return '';
                })
                .join('. ');
              return `${section}. ${itemsText}`;
            }
            return '';
          })
          .join('. ');
  
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Try to find Hindi or Indian English voice
        const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
        const indianEnglishVoice = voices.find(voice => voice.lang.includes('en-IN'));
        const englishVoice = voices.find(voice => voice.lang.includes('en'));
        
        utterance.voice = hindiVoice || indianEnglishVoice || englishVoice || voices[0];
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
  
        utterance.onend = () => {
          setIsReading(false);
          speechSynthRef.current = null;
        };
  
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsReading(false);
          speechSynthRef.current = null;
        };
  
        speechSynthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
  
      } catch (error) {
        console.error('Error starting speech:', error);
        setIsReading(false);
      }
    };
  
    startSpeaking();
  };
  
  // Add this useEffect to handle cleanup
  React.useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Optional: Add a "Scan Another" button after results are displayed
  // This button would only be visible for users who have access
  // const _renderScanAnotherButton = () => {
  //   if (!results) return null;
    
  //   const hasAccess = isAuthenticated ? 
  //     (user?.role === 'pro' || (user?.usageStats?.scanThisMonth || 0) < 5) : 
  //     usageCount < 1;
    
  //   if (!hasAccess) return null;
    
  //   return (
  //     <div className="text-center mt-8">
  //       <Button
  //         onClick={resetScan}
  //         className="gap-2 bg-green-600 hover:bg-green-700"
  //       >
  //         <TestTube2 className="w-4 h-4" />
  //         Scan Another Plant
  //       </Button>
  //     </div>
  //   );
  // };

  // Function to render treatment info with enhanced UI
  const renderTreatmentInfo = () => {
    if (!treatmentInfo) return null;

    const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
        <div className="p-2 rounded-full bg-green-100">
          {sectionIcons[title] || <Sprout className="w-5 h-5 text-green-600" />}
        </div>
        <h3 className="text-xl font-semibold text-green-800">{title}</h3>
      </div>
    );

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

    const renderItem = (item: any, idx: number, section: string) => {
      // Educational Resources with links
      if (section === "Educational Resources") {
        if (typeof item === 'object' && item.text && item.url) {
          return (
            <div key={idx} className="flex items-start gap-3 group">
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
          );
        }
        return null;
      }
  
      // Recommended Products
      if (section === "Recommended Products" && typeof item === 'object' && item.name) {
        return (
          <div key={idx} className="flex items-start gap-3">
            <span className="mt-1 text-orange-500">🛒</span>
            <div>
              <h4 className="font-medium text-orange-800">{item.name}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        );
      }
  
      // Immediate Control Measures
      if (section === "Immediate Control Measures") {
        return (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full">
              {idx + 1}
            </div>
            <p className="text-gray-700">{String(item)}</p>
          </div>
        );
      }
  
      // Default list item
      return (
        <div key={idx} className="flex items-start gap-3">
          <span className="mt-1 text-green-600">•</span>
          <p className="text-gray-700">{String(item)}</p>
        </div>
      );
    };
  
    return (
      <div className="space-y-8">
        {Object.entries(treatmentInfo)
          .filter(([key]) => key !== 'originalText')
          .map(([section, items]) => (
            <div key={section} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <SectionHeader title={section} />
              
              <div className="space-y-4 pl-4 border-l-4 border-green-100">
                {Array.isArray(items) && items.map((item, idx) => renderItem(item, idx, section))}
              </div>
            </div>
          ))}
  
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
    );
  };

  // Cancel speech when component unmounts
  React.useEffect(() => {
    return () => {
      if (isReading) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isReading]);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-8 flex items-center gap-3">
            <TestTube2 className="w-8 h-8" />
            Plant Disease Detection
            {user?.role === 'pro' && (
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Pro
              </Badge>
            )}
          </h1>

          {/* Usage indicator for non-pro users */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-gray-600 flex items-center justify-between">
                <span>Guest Mode: {usageCount}/1 scan used</span>
                {usageCount > 0 && (
                  <Button 
                    variant="link" 
                    className="text-green-600" 
                    onClick={() => window.location.href = '/signup'}
                  >
                    Sign Up for More
                  </Button>
                )}
              </p>
            </div>
          )}
          
          {isAuthenticated && user?.role !== 'pro' && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    Free Account: {userScansRemaining !== null ? `${5 - userScansRemaining}/5` : "Loading..."} monthly scans used
                  </p>
                  <p className="text-sm text-gray-500">Upgrade to Pro for unlimited scans</p>
                </div>
                <Button 
                  variant="default" 
                  onClick={() => window.location.href = '/SubToPro'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}

          {/* Access denied message */}
          {!accessGranted && (
            <div className="mb-8">
              <UpgradePrompt feature="scan" />
            </div>
          )}

          {accessGranted && (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-green-700 mb-4">
                      <LinkIcon className="w-5 h-5" />
                      <h3 className="text-xl font-semibold">Image URL</h3>
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste image URL here"
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <Button onClick={handleUrlSubmit} className="gap-2 bg-green-600 hover:bg-green-700">
                      Load URL
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
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

              {imageSrc && (
                <div className="text-center mb-12">
                  <Button
                    onClick={handleDetection}
                    disabled={loading}
                    size="lg"
                    className="gap-2 px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
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
            </>
          )}

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
                          <div 
                            key={index} 
                            className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow transition-shadow"
                          >
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

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-green-700">Treatment Guide</h3>
                        <Button 
                          onClick={handleReadAloud} 
                          variant="outline" 
                          className={`gap-2 ${isReading ? 'bg-red-50' : 'bg-green-50'}`}
                          disabled={!treatmentInfo || loadingTreatment}
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
                      </div>
                      
                      {loadingTreatment && (
                        <div className="flex items-center gap-2 text-green-700 p-6 bg-green-50 rounded-xl">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading treatment information...
                        </div>
                      )}

                      {treatmentError && (
                        <div className="text-red-600 flex items-center gap-2 p-6 bg-red-50 rounded-xl">
                          <AlertCircle className="w-5 h-5" />
                          {treatmentError}
                        </div>
                      )}

                      {treatmentInfo && renderTreatmentInfo()}
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {error && (
            <div className="text-red-600 flex items-center gap-2 mt-4 p-4 bg-red-50 rounded-lg">
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
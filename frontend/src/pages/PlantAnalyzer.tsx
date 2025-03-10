import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisResult {
  status: string;
  disease: string | null;
  confidence: number;
  treatment?: string;
  prevention?: string[];
}

const PlantAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Example usage of state setters
  const handleAnalysis = () => {
    setAnalyzing(true);
    setResult(null);
    
    // After analysis is complete:
    // setAnalyzing(false);
    // setResult({
    //   status: 'Healthy',
    //   disease: null,
    //   confidence: 95,
    //   prevention: ['Regular watering', 'Proper sunlight']
    // });
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button 
          onClick={handleAnalysis} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Analyze Plant
        </button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <p className="mt-4 text-gray-600">Analyzing your plant...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {result.status === 'Healthy' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.status}
                    {result.disease && ` - ${result.disease}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Confidence: {result.confidence}%
                  </p>
                </div>
              </div>

              {result.treatment && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Treatment</h4>
                  <p className="text-gray-600">{result.treatment}</p>
                </div>
              )}

              {result.prevention && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prevention Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.prevention.map((tip, index) => (
                      <li key={index} className="text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              Upload an image to begin analysis
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantAnalyzer;
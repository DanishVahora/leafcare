import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Copy, Check } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: {
    email: () => void;
    whatsapp: () => void;
    clipboard: () => void;
  };
  copied: boolean;
  resultData: {
    disease: string;
    confidence: number;
  };
}

export function ShareDialog({ open, onOpenChange, onShare, copied, resultData }: ShareDialogProps) {
  const confidencePercentage = Math.round(resultData.confidence * 100);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4 border-gray-200">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold text-gray-900">Share Results</DialogTitle>
            {/* <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-600" />
            </Button> */}
          </div>
          <DialogDescription className="text-gray-600 mt-1">
            Share your plant disease analysis results
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-14 hover:bg-gray-50 border-gray-200 text-gray-900" 
            onClick={onShare.email}
          >
            <div className="p-2 bg-green-100 rounded-md">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Email</span>
              <span className="text-xs text-gray-600">Share results via email</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-14 hover:bg-gray-50 border-gray-200 text-gray-900" 
            onClick={onShare.whatsapp}
          >
            <div className="p-2 bg-green-100 rounded-md">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">WhatsApp</span>
              <span className="text-xs text-gray-600">Share results on WhatsApp</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-14 hover:bg-gray-50 border-gray-200 text-gray-900" 
            onClick={onShare.clipboard}
          >
            <div className="p-2 bg-green-100 rounded-md">
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              <span className="text-xs text-gray-600">Copy results as text</span>
            </div>
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 mt-2 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-green-800">Analysis Results</span>
            <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded">AI Detected</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Disease:</span>
              <span className="font-medium text-gray-900">{resultData.disease}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium text-green-600">{confidencePercentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-md text-sm transition-all duration-200"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}